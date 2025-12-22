// @ts-nocheck - Admin quotes API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET /api/admin/quotes - Get all quotes with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const source = searchParams.get('source'); // 'quick' or 'renin' or 'all'

    const supabase = await createClient();

    // Fetch both quote types
    const promises = [];

    if (!source || source === 'all' || source === 'quick') {
      let quickQuery = supabase
        .from('quote_requests')
        .select('*')
        .order('received_at', { ascending: false });

      if (status && status !== 'all') {
        quickQuery = quickQuery.eq('status', status);
      }

      if (search) {
        quickQuery = quickQuery.or(
          `customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`
        );
      }

      promises.push(quickQuery.then(result => ({ ...result, source: 'quick' })));
    }

    if (!source || source === 'all' || source === 'renin') {
      let reninQuery = supabase
        .from('renin_quote_requests')
        .select('*')
        .order('received_at', { ascending: false });

      if (status && status !== 'all') {
        reninQuery = reninQuery.eq('status', status);
      }

      if (search) {
        reninQuery = reninQuery.or(
          `customer_data->>firstName.ilike.%${search}%,customer_data->>lastName.ilike.%${search}%,customer_data->>email.ilike.%${search}%`
        );
      }

      promises.push(reninQuery.then(result => ({ ...result, source: 'renin' })));
    }

    const results = await Promise.all(promises);

    // Combine and normalize the data
    const quotes = [];

    results.forEach(({ data, error, source: quoteSource }) => {
      if (error) {
        console.error(`Error fetching ${quoteSource} quotes:`, error);
        return;
      }

      if (data) {
        data.forEach((quote: any) => {
          if (quoteSource === 'quick') {
            quotes.push({
              id: quote.id,
              quote_number: quote.quote_number,
              source: 'quick',
              customer_name: quote.customer_name,
              customer_email: quote.customer_email,
              customer_phone: quote.customer_phone,
              product_name: quote.product_name,
              product_category: quote.product_category,
              product_price: quote.product_price,
              status: quote.status || 'pending',
              received_at: quote.received_at,
              notes: quote.notes,
              metadata: quote.metadata,
            });
          } else {
            // Renin quote
            const customerData = quote.customer_data || {};
            const productsData = quote.products_data || [];
            const productNames = productsData.map((p: any) => p.productName).join(', ');

            quotes.push({
              id: quote.id,
              quote_number: quote.quote_number,
              source: 'renin',
              customer_name: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim(),
              customer_email: customerData.email,
              customer_phone: null,
              product_name: productNames || 'Multiple Products',
              product_category: 'Renin Ottawa',
              product_price: quote.total_amount,
              status: quote.status || 'pending',
              received_at: quote.received_at,
              notes: quote.project_details?.additionalNotes || null,
              metadata: quote.metadata,
              customer_data: customerData,
              products_data: productsData,
              quote_calculation: quote.quote_calculation,
            });
          }
        });
      }
    });

    // Sort by received_at descending
    quotes.sort((a, b) => {
      const dateA = new Date(a.received_at);
      const dateB = new Date(b.received_at);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json({
      success: true,
      quotes,
      count: quotes.length,
    });
  } catch (error) {
    console.error('Admin quotes GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/quotes - Update quote status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, source, status, notes } = body;

    if (!id || !source) {
      return NextResponse.json(
        { error: 'Quote ID and source are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const tableName = source === 'quick' ? 'quote_requests' : 'renin_quote_requests';

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
    }

    if (notes !== undefined) {
      if (source === 'quick') {
        updateData.admin_notes = notes;
      } else {
        updateData.admin_notes = notes;
      }
    }

    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating quote:', error);
      return NextResponse.json(
        { error: 'Failed to update quote' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quote: data,
    });
  } catch (error) {
    console.error('Admin quote update error:', error);
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}
