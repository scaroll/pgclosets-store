/**
 * Email Marketing Workflow Engine
 *
 * Production-ready workflow automation system that manages:
 * - Multi-step email sequences
 * - Conditional logic and branching
 * - Scheduling and timing
 * - Workflow state management
 * - Trigger-based automation
 */

import type { EmailPayload } from '../esp-integration-agent';
import { ESPIntegrationAgent } from '../esp-integration-agent';

export type WorkflowTrigger =
  | 'user_signup'
  | 'newsletter_subscribe'
  | 'quote_submit'
  | 'quote_abandon'
  | 'cart_abandon'
  | 'purchase_complete'
  | 'consultation_booked'
  | 'user_inactive'
  | 'product_launch'
  | 'manual';

export type WorkflowStatus = 'active' | 'paused' | 'completed' | 'cancelled';

export type EmailDelay =
  | { type: 'immediate' }
  | { type: 'minutes'; value: number }
  | { type: 'hours'; value: number }
  | { type: 'days'; value: number };

export interface WorkflowEmail {
  id: string;
  name: string;
  subject: string;
  templateId: string;
  delay: EmailDelay;
  condition?: (context: WorkflowContext) => boolean;
  abTest?: {
    enabled: boolean;
    variants: Array<{
      id: string;
      subject: string;
      templateId: string;
      weight: number;
    }>;
  };
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  emails: WorkflowEmail[];
  settings: {
    maxRetries: number;
    unsubscribeAction: 'stop' | 'pause';
    timezoneAware: boolean;
    sendTimeOptimization: boolean;
  };
}

export interface WorkflowContext {
  userId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  metadata: Record<string, any>;
  segment?: string;
  tags?: string[];
  customData?: Record<string, any>;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  context: WorkflowContext;
  status: WorkflowStatus;
  currentStep: number;
  startedAt: Date;
  completedAt?: Date;
  pausedAt?: Date;
  cancelledAt?: Date;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  lastEmailSentAt?: Date;
  nextEmailScheduledFor?: Date;
}

/**
 * Workflow Engine - Core automation system
 */
export class WorkflowEngine {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private instances: Map<string, WorkflowInstance> = new Map();
  private espAgent: ESPIntegrationAgent;

  constructor(provider: 'resend' | 'sendgrid' | 'ses' | 'mailgun' | 'postmark' = 'resend') {
    this.espAgent = new ESPIntegrationAgent(provider);
  }

  /**
   * Register a workflow definition
   */
  registerWorkflow(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.id, workflow);
    console.log(`📋 Registered workflow: ${workflow.name} (${workflow.id})`);
  }

  /**
   * Start a workflow for a user
   */
  async startWorkflow(
    workflowId: string,
    context: WorkflowContext
  ): Promise<{
    success: boolean;
    instanceId?: string;
    error?: string;
  }> {
    const workflow = this.workflows.get(workflowId);

    if (!workflow) {
      return {
        success: false,
        error: `Workflow not found: ${workflowId}`
      };
    }

    // Create workflow instance
    const instance: WorkflowInstance = {
      id: this.generateInstanceId(),
      workflowId,
      context,
      status: 'active',
      currentStep: 0,
      startedAt: new Date(),
      emailsSent: 0,
      emailsOpened: 0,
      emailsClicked: 0
    };

    this.instances.set(instance.id, instance);

    // Send first email if it's immediate
    const firstEmail = workflow.emails[0];
    if (firstEmail && firstEmail.delay.type === 'immediate') {
      const result = await this.sendWorkflowEmail(instance, firstEmail, workflow);

      if (result.success) {
        instance.emailsSent++;
        instance.lastEmailSentAt = new Date();
        instance.currentStep++;

        // Schedule next email
        this.scheduleNextEmail(instance, workflow);
      }
    } else {
      // Schedule first email
      this.scheduleNextEmail(instance, workflow);
    }

    console.log(`🚀 Started workflow "${workflow.name}" for ${context.email} (instance: ${instance.id})`);

    return {
      success: true,
      instanceId: instance.id
    };
  }

  /**
   * Send a workflow email
   */
  private async sendWorkflowEmail(
    instance: WorkflowInstance,
    email: WorkflowEmail,
    workflow: WorkflowDefinition
  ): Promise<{
    success: boolean;
    messageId?: string;
  }> {
    // Check condition if exists
    if (email.condition && !email.condition(instance.context)) {
      console.log(`⏭️ Skipping email "${email.name}" - condition not met`);
      return { success: true }; // Skip but don't fail
    }

    // Handle A/B testing
    const emailToSend = email.abTest?.enabled
      ? this.selectABVariant(email)
      : email;

    // Build email payload
    const payload: EmailPayload = {
      from: process.env.EMAIL_FROM || 'PG Closets <hello@pgclosets.ca>',
      to: instance.context.email,
      subject: this.personalizeString(emailToSend.subject, instance.context),
      html: await this.renderTemplate(emailToSend.templateId, instance.context),
      tags: [
        { name: 'workflow', value: workflow.id },
        { name: 'workflow-name', value: workflow.name },
        { name: 'email-id', value: email.id },
        { name: 'instance-id', value: instance.id }
      ]
    };

    // Send via ESP
    const result = await this.espAgent.send(payload);

    if (result.success) {
      console.log(`✅ Sent "${email.name}" to ${instance.context.email}`);
    } else {
      console.error(`❌ Failed to send "${email.name}": ${result.error}`);
    }

    return {
      success: result.success,
      messageId: result.messageId
    };
  }

  /**
   * Schedule next email in workflow
   */
  private scheduleNextEmail(
    instance: WorkflowInstance,
    workflow: WorkflowDefinition
  ): void {
    const nextEmail = workflow.emails[instance.currentStep];

    if (!nextEmail) {
      // Workflow complete
      this.completeWorkflow(instance.id);
      return;
    }

    // Calculate next send time
    const delayMs = this.calculateDelay(nextEmail.delay);
    const baseTime = instance.lastEmailSentAt || instance.startedAt;
    const nextSendTime = new Date(baseTime.getTime() + delayMs);

    // Apply send time optimization if enabled
    if (workflow.settings.sendTimeOptimization) {
      const optimizedTime = this.optimizeSendTime(nextSendTime, instance.context);
      instance.nextEmailScheduledFor = optimizedTime;
    } else {
      instance.nextEmailScheduledFor = nextSendTime;
    }

    console.log(`📅 Next email "${nextEmail.name}" scheduled for ${instance.nextEmailScheduledFor.toISOString()}`);

    // In production, this would create a job in a queue (BullMQ, Inngest, etc.)
    // For now, we'll store the schedule
  }

  /**
   * Process scheduled emails (called by cron job)
   */
  async processScheduledEmails(): Promise<void> {
    const now = new Date();

    for (const [instanceId, instance] of this.instances.entries()) {
      if (
        instance.status === 'active' &&
        instance.nextEmailScheduledFor &&
        instance.nextEmailScheduledFor <= now
      ) {
        const workflow = this.workflows.get(instance.workflowId);
        if (!workflow) continue;

        const email = workflow.emails[instance.currentStep];
        if (!email) continue;

        const result = await this.sendWorkflowEmail(instance, email, workflow);

        if (result.success) {
          instance.emailsSent++;
          instance.lastEmailSentAt = now;
          instance.currentStep++;
          instance.nextEmailScheduledFor = undefined;

          this.scheduleNextEmail(instance, workflow);
        }
      }
    }
  }

  /**
   * Pause a workflow instance
   */
  pauseWorkflow(instanceId: string): boolean {
    const instance = this.instances.get(instanceId);
    if (!instance) return false;

    instance.status = 'paused';
    instance.pausedAt = new Date();
    console.log(`⏸️ Paused workflow instance ${instanceId}`);
    return true;
  }

  /**
   * Resume a paused workflow
   */
  resumeWorkflow(instanceId: string): boolean {
    const instance = this.instances.get(instanceId);
    if (!instance || instance.status !== 'paused') return false;

    instance.status = 'active';
    instance.pausedAt = undefined;

    // Recalculate next send time
    const workflow = this.workflows.get(instance.workflowId);
    if (workflow) {
      this.scheduleNextEmail(instance, workflow);
    }

    console.log(`▶️ Resumed workflow instance ${instanceId}`);
    return true;
  }

  /**
   * Cancel a workflow instance
   */
  cancelWorkflow(instanceId: string): boolean {
    const instance = this.instances.get(instanceId);
    if (!instance) return false;

    instance.status = 'cancelled';
    instance.cancelledAt = new Date();
    instance.nextEmailScheduledFor = undefined;
    console.log(`🛑 Cancelled workflow instance ${instanceId}`);
    return true;
  }

  /**
   * Complete a workflow instance
   */
  private completeWorkflow(instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (!instance) return;

    instance.status = 'completed';
    instance.completedAt = new Date();
    instance.nextEmailScheduledFor = undefined;
    console.log(`✅ Completed workflow instance ${instanceId}`);
  }

  /**
   * Get workflow instance details
   */
  getInstance(instanceId: string): WorkflowInstance | undefined {
    return this.instances.get(instanceId);
  }

  /**
   * Get all instances for a user
   */
  getUserInstances(email: string): WorkflowInstance[] {
    return Array.from(this.instances.values()).filter(
      instance => instance.context.email === email
    );
  }

  /**
   * Get workflow statistics
   */
  getWorkflowStats(workflowId: string): {
    totalInstances: number;
    activeInstances: number;
    completedInstances: number;
    totalEmailsSent: number;
    avgOpenRate: number;
    avgClickRate: number;
  } {
    const instances = Array.from(this.instances.values()).filter(
      instance => instance.workflowId === workflowId
    );

    const totalEmailsSent = instances.reduce((sum, i) => sum + i.emailsSent, 0);
    const totalOpens = instances.reduce((sum, i) => sum + i.emailsOpened, 0);
    const totalClicks = instances.reduce((sum, i) => sum + i.emailsClicked, 0);

    return {
      totalInstances: instances.length,
      activeInstances: instances.filter(i => i.status === 'active').length,
      completedInstances: instances.filter(i => i.status === 'completed').length,
      totalEmailsSent,
      avgOpenRate: totalEmailsSent > 0 ? (totalOpens / totalEmailsSent) * 100 : 0,
      avgClickRate: totalEmailsSent > 0 ? (totalClicks / totalEmailsSent) * 100 : 0
    };
  }

  /**
   * Helper: Calculate delay in milliseconds
   */
  private calculateDelay(delay: EmailDelay): number {
    switch (delay.type) {
      case 'immediate':
        return 0;
      case 'minutes':
        return delay.value * 60 * 1000;
      case 'hours':
        return delay.value * 60 * 60 * 1000;
      case 'days':
        return delay.value * 24 * 60 * 60 * 1000;
    }
  }

  /**
   * Helper: Personalize string with context data
   */
  private personalizeString(template: string, context: WorkflowContext): string {
    return template
      .replace(/\{\{firstName\}\}/g, context.firstName || 'there')
      .replace(/\{\{lastName\}\}/g, context.lastName || '')
      .replace(/\{\{email\}\}/g, context.email);
  }

  /**
   * Helper: Render email template
   */
  private async renderTemplate(templateId: string, context: WorkflowContext): Promise<string> {
    // In production, this would load and render React Email templates
    // For now, return a placeholder
    return `<html><body><p>Template: ${templateId}</p></body></html>`;
  }

  /**
   * Helper: Select A/B test variant
   */
  private selectABVariant(email: WorkflowEmail): WorkflowEmail {
    if (!email.abTest) return email;

    const random = Math.random() * 100;
    let cumulative = 0;

    for (const variant of email.abTest.variants) {
      cumulative += variant.weight;
      if (random <= cumulative) {
        return {
          ...email,
          subject: variant.subject,
          templateId: variant.templateId
        };
      }
    }

    return email;
  }

  /**
   * Helper: Optimize send time based on user behavior
   */
  private optimizeSendTime(scheduledTime: Date, context: WorkflowContext): Date {
    // In production, analyze user's historical open times
    // For now, adjust to optimal hours (9 AM - 5 PM local time)
    const hour = scheduledTime.getHours();

    if (hour < 9) {
      scheduledTime.setHours(9, 0, 0, 0);
    } else if (hour >= 17) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
      scheduledTime.setHours(9, 0, 0, 0);
    }

    return scheduledTime;
  }

  /**
   * Helper: Generate unique instance ID
   */
  private generateInstanceId(): string {
    return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default WorkflowEngine;
