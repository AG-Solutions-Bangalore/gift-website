/**
 * Enquiry Service to create customer/corporate inquiries via CRM API (createenquiry)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://memorycreators.in/crmapi/public/api';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || '';

/**
 * Creates an inquiry in CRM
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.mobile
 * @param {string} params.address
 * @param {Array}  params.items
 */
export async function createEnquiry(params = {}) {
  try {
    // Support both raw schema keys and convenient shorthand keys
    const name = params.enquiry_name || params.name || '';
    const mobile = params.enquiry_mobile || params.mobile || params.phone || '';
    const address = params.enquiry_address || params.address || '';
    const rawItems = params.sub || params.items || [];

    if (!name || !name.trim()) {
      throw new Error('Please enter your full name.');
    }
    if (!mobile || !mobile.trim()) {
      throw new Error('Please enter your mobile number.');
    }

    const endpoint = `${API_BASE_URL.replace(/\/+$/, '')}/createenquiry`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (API_TOKEN) {
      headers['Authorization'] = `Bearer ${API_TOKEN}`;
    }

    // Format sub items according to CRM schema
    const sub = rawItems && rawItems.length > 0
      ? rawItems.map((item) => ({
          enquiry_share_id: String(item.enquiry_share_id ?? item.shareId ?? item.share_id ?? 1),
          enquiry_product_id: String(item.enquiry_product_id ?? item.productId ?? item.product_id ?? item.id ?? 1),
          enquiry_product_variant_id: String(item.enquiry_product_variant_id ?? item.variantId ?? item.variant_id ?? 1),
          enquiry_quantity: String(item.enquiry_quantity ?? item.quantity ?? 1),
          enquiry_mrp: String(item.enquiry_mrp ?? item.originalPrice ?? item.mrp ?? item.price ?? 999),
          enquiry_sale_price: String(item.enquiry_sale_price ?? item.price ?? item.sale_price ?? 999),
          enquiry_bulk_price: String(item.enquiry_bulk_price ?? item.bulkPrice ?? item.bulk_price ?? item.price ?? 999),
        }))
      : [
          {
            enquiry_share_id: '1',
            enquiry_product_id: '1',
            enquiry_product_variant_id: '1',
            enquiry_quantity: '1',
            enquiry_mrp: '999',
            enquiry_sale_price: '999',
            enquiry_bulk_price: '999',
          }
        ];

    const payload = {
      enquiry_name: name.trim(),
      enquiry_mobile: mobile.trim(),
      enquiry_address: (address || 'Not specified').trim(),
      sub,
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.code && data.code >= 400)) {
      const msg = data?.message || data?.data?.message || data?.error || `HTTP ${response.status}: Failed to submit enquiry`;
      throw new Error(msg);
    }

    return {
      success: true,
      data,
      message: data?.message || data?.data?.message || 'Your inquiry has been submitted successfully!',
    };
  } catch (error) {
    console.error('Failed to create enquiry:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit enquiry. Please try again.',
    };
  }
}
