/**
 * Business Operations Integration Hub
 * Centralizes CRM, accounting, shipping, and customer support integrations
 */

import quickbooks from 'quickbooks-sdk';
import * as jsforce from 'jsforce';
import { ZendeskClient } from 'zendesk-client';

// Business Operations Configuration
export interface BusinessConfig {
  quickbooks?: {
    clientId: string;
    clientSecret: string;
    environment: 'sandbox' | 'production';
    redirectUri: string;
    realmId?: string;
    accessToken?: string;
    refreshToken?: string;
  };
  salesforce?: {
    loginUrl: string;
    username: string;
    password: string;
    securityToken: string;
    version?: string;
  };
  zendesk?: {
    subdomain: string;
    username: string;
    token: string;
  };
  shipstation?: {
    apiKey: string;
    apiSecret: string;
    baseUrl: string;
  };
}

export class BusinessHub {
  private config: BusinessConfig;
  private quickbooksClient: any = null;
  private salesforceConn: jsforce.Connection | null = null;
  private zendeskClient: ZendeskClient | null = null;

  constructor(config: BusinessConfig) {
    this.config = config;
    this.initializeServices();
  }

  private async initializeServices() {
    // Initialize QuickBooks
    if (this.config.quickbooks) {
      this.quickbooksClient = quickbooks;
    }

    // Initialize Salesforce
    if (this.config.salesforce) {
      this.salesforceConn = new jsforce.Connection({
        loginUrl: this.config.salesforce.loginUrl,
        version: this.config.salesforce.version || '58.0',
      });

      try {
        await this.salesforceConn.login(
          this.config.salesforce.username,
          this.config.salesforce.password + this.config.salesforce.securityToken
        );
      } catch (error) {
        console.error('Salesforce login failed:', error);
      }
    }

    // Initialize Zendesk
    if (this.config.zendesk) {
      this.zendeskClient = new ZendeskClient({
        subdomain: this.config.zendesk.subdomain,
        username: this.config.zendesk.username,
        token: this.config.zendesk.token,
      });
    }
  }

  // QuickBooks Methods
  async createQuickBooksCustomer(customerData: {
    displayName: string;
    email: string;
    phone?: string;
    address?: {
      line1?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  }) {
    if (!this.config.quickbooks) throw new Error('QuickBooks not configured');

    try {
      const customer = {
        DisplayName: customerData.displayName,
        PrimaryEmailAddr: {
          Address: customerData.email,
        },
        PrimaryPhone: customerData.phone ? {
          FreeFormNumber: customerData.phone,
        } : undefined,
        BillAddr: customerData.address ? {
          Line1: customerData.address.line1,
          City: customerData.address.city,
          CountrySubDivisionCode: customerData.address.state,
          PostalCode: customerData.address.postalCode,
          Country: customerData.address.country,
        } : undefined,
      };

      const response = await this.quickbooksClient.customer.create({
        accessToken: this.config.quickbooks.accessToken!,
        realmId: this.config.quickbooks.realmId!,
        customer,
      });

      return response;
    } catch (error) {
      console.error('QuickBooks customer creation error:', error);
      throw error;
    }
  }

  async createQuickBooksInvoice(invoiceData: {
    customerId: string;
    lineItems: Array<{
      description: string;
      amount: number;
      quantity: number;
    }>;
    dueDate?: string;
  }) {
    if (!this.config.quickbooks) throw new Error('QuickBooks not configured');

    try {
      const invoice = {
        CustomerRef: {
          value: invoiceData.customerId,
        },
        Line: invoiceData.lineItems.map(item => ({
          Description: item.description,
          Amount: item.amount * item.quantity,
          DetailType: 'SalesItemLineDetail',
          SalesItemLineDetail: {
            Qty: item.quantity,
            UnitPrice: item.amount,
          },
        })),
        DueDate: invoiceData.dueDate,
      };

      const response = await this.quickbooksClient.invoice.create({
        accessToken: this.config.quickbooks.accessToken!,
        realmId: this.config.quickbooks.realmId!,
        invoice,
      });

      return response;
    } catch (error) {
      console.error('QuickBooks invoice creation error:', error);
      throw error;
    }
  }

  async createQuickBooksPayment(paymentData: {
    invoiceId: string;
    customerId: string;
    amount: number;
    paymentMethod: string;
  }) {
    if (!this.config.quickbooks) throw new Error('QuickBooks not configured');

    try {
      const payment = {
        CustomerRef: {
          value: paymentData.customerId,
        },
        TotalAmt: paymentData.amount,
        PaymentMethodRef: {
          value: paymentData.paymentMethod,
        },
        Line: [
          {
            LinkedTxn: [
              {
                TxnId: paymentData.invoiceId,
                TxnType: 'Invoice',
              },
            ],
            Amount: paymentData.amount,
          },
        ],
      };

      const response = await this.quickbooksClient.payment.create({
        accessToken: this.config.quickbooks.accessToken!,
        realmId: this.config.quickbooks.realmId!,
        payment,
      });

      return response;
    } catch (error) {
      console.error('QuickBooks payment creation error:', error);
      throw error;
    }
  }

  // Salesforce Methods
  async createSalesforceLead(leadData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    source?: string;
    status?: string;
  }) {
    if (!this.salesforceConn) throw new Error('Salesforce not connected');

    try {
      const lead = {
        FirstName: leadData.firstName,
        LastName: leadData.lastName,
        Email: leadData.email,
        Phone: leadData.phone,
        Company: leadData.company,
        LeadSource: leadData.source || 'Website',
        Status: leadData.status || 'New',
      };

      const result = await this.salesforceConn.sobject('Lead').create(lead);
      return result;
    } catch (error) {
      console.error('Salesforce lead creation error:', error);
      throw error;
    }
  }

  async createSalesforceContact(contactData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    accountId?: string;
  }) {
    if (!this.salesforceConn) throw new Error('Salesforce not connected');

    try {
      const contact = {
        FirstName: contactData.firstName,
        LastName: contactData.lastName,
        Email: contactData.email,
        Phone: contactData.phone,
        AccountId: contactData.accountId,
      };

      const result = await this.salesforceConn.sobject('Contact').create(contact);
      return result;
    } catch (error) {
      console.error('Salesforce contact creation error:', error);
      throw error;
    }
  }

  async createSalesforceOpportunity(opportunityData: {
    name: string;
    accountId: string;
    closeDate: string;
    stageName: string;
    amount?: number;
    description?: string;
  }) {
    if (!this.salesforceConn) throw new Error('Salesforce not connected');

    try {
      const opportunity = {
        Name: opportunityData.name,
        AccountId: opportunityData.accountId,
        CloseDate: opportunityData.closeDate,
        StageName: opportunityData.stageName,
        Amount: opportunityData.amount,
        Description: opportunityData.description,
      };

      const result = await this.salesforceConn.sobject('Opportunity').create(opportunity);
      return result;
    } catch (error) {
      console.error('Salesforce opportunity creation error:', error);
      throw error;
    }
  }

  async updateSalesforceRecord(objectType: string, recordId: string, updateData: Record<string, any>) {
    if (!this.salesforceConn) throw new Error('Salesforce not connected');

    try {
      const result = await this.salesforceConn.sobject(objectType).update({
        Id: recordId,
        ...updateData,
      });
      return result;
    } catch (error) {
      console.error('Salesforce record update error:', error);
      throw error;
    }
  }

  async querySalesforce(soql: string) {
    if (!this.salesforceConn) throw new Error('Salesforce not connected');

    try {
      const result = await this.salesforceConn.query(soql);
      return result;
    } catch (error) {
      console.error('Salesforce query error:', error);
      throw error;
    }
  }

  // Zendesk Methods
  async createZendeskTicket(ticketData: {
    subject: string;
    description: string;
    requesterEmail: string;
    requesterName: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    tags?: string[];
  }) {
    if (!this.zendeskClient) throw new Error('Zendesk not connected');

    try {
      const ticket = {
        ticket: {
          subject: ticketData.subject,
          comment: { body: ticketData.description },
          requester: {
            email: ticketData.requesterEmail,
            name: ticketData.requesterName,
          },
          priority: ticketData.priority || 'normal',
          tags: ticketData.tags || [],
        },
      };

      const response = await this.zendeskClient.tickets.create(ticket);
      return response;
    } catch (error) {
      console.error('Zendesk ticket creation error:', error);
      throw error;
    }
  }

  async updateZendeskTicket(ticketId: string, updateData: {
    comment?: string;
    status?: 'new' | 'open' | 'pending' | 'hold' | 'solved' | 'closed';
    assigneeId?: number;
  }) {
    if (!this.zendeskClient) throw new Error('Zendesk not connected');

    try {
      const ticket = {
        ticket: updateData,
      };

      const response = await this.zendeskClient.tickets.update(ticketId, ticket);
      return response;
    } catch (error) {
      console.error('Zendesk ticket update error:', error);
      throw error;
    }
  }

  async searchZendeskTickets(query: string) {
    if (!this.zendeskClient) throw new Error('Zendesk not connected');

    try {
      const response = await this.zendeskClient.search.query(`query="${query}" type:ticket`);
      return response;
    } catch (error) {
      console.error('Zendesk ticket search error:', error);
      throw error;
    }
  }

  // ShipStation Methods
  async createShipStationOrder(orderData: {
    orderNumber: string;
    orderDate: string;
    orderStatus: string;
    customerId?: string;
    customerEmail: string;
    shipTo: {
      name: string;
      street1: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone?: string;
    };
    items: Array<{
      sku: string;
      name: string;
      quantity: number;
      unitPrice: number;
    }>;
    weight: {
      value: number;
      units: string;
    };
  }) {
    try {
      const order = {
        orderNumber: orderData.orderNumber,
        orderDate: orderData.orderDate,
        orderStatus: orderData.orderStatus,
        customerId: orderData.customerId,
        customerEmail: orderData.customerEmail,
        shipTo: orderData.shipTo,
        items: orderData.items,
        weight: orderData.weight,
      };

      const response = await fetch('/api/shipstation/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(
            `${this.config.shipstation?.apiKey}:${this.config.shipstation?.apiSecret}`
          ).toString('base64')}`,
        },
        body: JSON.stringify(order),
      });

      return response.json();
    } catch (error) {
      console.error('ShipStation order creation error:', error);
      throw error;
    }
  }

  async createShipStationLabel(orderId: string, carrierCode: string, serviceCode: string, packageCode: string) {
    try {
      const labelRequest = {
        orderId: orderId,
        carrierCode: carrierCode,
        serviceCode: serviceCode,
        packageCode: packageCode,
        confirmation: 'delivery',
        addressVerified: 'yes',
      };

      const response = await fetch('/api/shipstation/labels/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(
            `${this.config.shipstation?.apiKey}:${this.config.shipstation?.apiSecret}`
          ).toString('base64')}`,
        },
        body: JSON.stringify(labelRequest),
      });

      return response.json();
    } catch (error) {
      console.error('ShipStation label creation error:', error);
      throw error;
    }
  }

  // Unified Business Operations
  async syncOrderToAllSystems(orderData: {
    id: string;
    customer: {
      email: string;
      name: string;
      phone?: string;
      address?: any;
    };
    items: any[];
    total: number;
    status: string;
  }) {
    const results = {
      quickbooks: null,
      salesforce: null,
      zendesk: null,
      shipstation: null,
    };

    try {
      // Create customer in QuickBooks
      if (this.config.quickbooks) {
        const qbCustomer = await this.createQuickBooksCustomer({
          displayName: orderData.customer.name,
          email: orderData.customer.email,
          phone: orderData.customer.phone,
          address: orderData.customer.address,
        });
        results.quickbooks = qbCustomer;
      }

      // Create lead/contact in Salesforce
      if (this.salesforceConn) {
        const [firstName, lastName] = orderData.customer.name.split(' ');
        const sfLead = await this.createSalesforceLead({
          firstName: firstName || '',
          lastName: lastName || 'Customer',
          email: orderData.customer.email,
          phone: orderData.customer.phone,
          source: 'Website Order',
          status: 'New',
        });
        results.salesforce = sfLead;
      }

      // Create support ticket in Zendesk if needed
      if (this.zendeskClient && orderData.status === 'issues') {
        const ticket = await this.createZendeskTicket({
          subject: `Order #${orderData.id} Issue`,
          description: `Customer has reported an issue with order #${orderData.id}`,
          requesterEmail: orderData.customer.email,
          requesterName: orderData.customer.name,
          priority: 'normal',
          tags: ['order', 'issue'],
        });
        results.zendesk = ticket;
      }

      // Create shipping order in ShipStation
      if (this.config.shipstation) {
        const ssOrder = await this.createShipStationOrder({
          orderNumber: orderData.id,
          orderDate: new Date().toISOString(),
          orderStatus: orderData.status,
          customerEmail: orderData.customer.email,
          shipTo: {
            name: orderData.customer.name,
            street1: orderData.customer.address?.line1 || '',
            city: orderData.customer.address?.city || '',
            state: orderData.customer.address?.state || '',
            postalCode: orderData.customer.address?.postalCode || '',
            country: orderData.customer.address?.country || 'US',
            phone: orderData.customer.phone,
          },
          items: orderData.items.map(item => ({
            sku: item.sku,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
          weight: {
            value: 2, // Calculate actual weight
            units: 'pounds',
          },
        });
        results.shipstation = ssOrder;
      }

      return results;
    } catch (error) {
      console.error('Error syncing order to business systems:', error);
      throw error;
    }
  }

  // Reporting and Analytics
  async getBusinessMetrics() {
    const metrics = {
      quickbooks: {
        totalRevenue: 0,
        totalInvoices: 0,
        outstandingInvoices: 0,
      },
      salesforce: {
        totalLeads: 0,
        totalOpportunities: 0,
        wonOpportunities: 0,
      },
      zendesk: {
        totalTickets: 0,
        openTickets: 0,
        averageResponseTime: 0,
      },
      shipstation: {
        totalOrders: 0,
        shippedOrders: 0,
        totalShippingCost: 0,
      },
    };

    // Gather metrics from each system
    // This would involve making API calls to get aggregate data

    return metrics;
  }

  // Error Handling
  handleBusinessError(error: any, system: string) {
    console.error(`${system} business operation error:`, error);

    return {
      system,
      error: true,
      message: error.message || 'Business operation failed',
      code: error.code || 'BUSINESS_ERROR',
      details: error,
    };
  }
}

// Configuration Helper
export const getBusinessConfig = (): BusinessConfig => {
  return {
    quickbooks: {
      clientId: process.env.QUICKBOOKS_CLIENT_ID!,
      clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
      environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production',
      redirectUri: process.env.QUICKBOOKS_REDIRECT_URI!,
      realmId: process.env.QUICKBOOKS_REALM_ID,
      accessToken: process.env.QUICKBOOKS_ACCESS_TOKEN,
      refreshToken: process.env.QUICKBOOKS_REFRESH_TOKEN,
    },
    salesforce: {
      loginUrl: process.env.SALESFORCE_LOGIN_URL!,
      username: process.env.SALESFORCE_USERNAME!,
      password: process.env.SALESFORCE_PASSWORD!,
      securityToken: process.env.SALESFORCE_SECURITY_TOKEN!,
      version: process.env.SALESFORCE_API_VERSION || '58.0',
    },
    zendesk: {
      subdomain: process.env.ZENDESK_SUBDOMAIN!,
      username: process.env.ZENDESK_USERNAME!,
      token: process.env.ZENDESK_TOKEN!,
    },
    shipstation: {
      apiKey: process.env.SHIPSTATION_API_KEY!,
      apiSecret: process.env.SHIPSTATION_API_SECRET!,
      baseUrl: process.env.SHIPSTATION_BASE_URL || 'https://ssapi.shipstation.com',
    },
  };
};