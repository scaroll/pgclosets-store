/**
 * Marketing & SEO Integration Hub
 * Centralizes marketing automation, SEO tools, and review platforms
 */

import axios from 'axios';

// Marketing Configuration
export interface MarketingConfig {
  semrush?: {
    apiKey: string;
    baseUrl: string;
  };
  ahrefs?: {
    accessToken: string;
    baseUrl: string;
  };
  googleSearchConsole?: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    refreshToken?: string;
    siteUrl?: string;
  };
  yelp?: {
    apiKey: string;
    clientId: string;
    clientSecret: string;
  };
  houzz?: {
    apiKey: string;
    baseUrl: string;
  };
}

export class MarketingHub {
  private config: MarketingConfig;
  private gscAccessToken: string | null = null;

  constructor(config: MarketingConfig) {
    this.config = config;
    this.initialize();
  }

  private async initialize() {
    // Initialize Google Search Console access
    if (this.config.googleSearchConsole?.refreshToken) {
      await this.refreshGSCAccessToken();
    }
  }

  // SEMrush Methods
  async getSEMrushKeywordData(keywords: string[], database: string = 'us') {
    if (!this.config.semrush) throw new Error('SEMrush not configured');

    try {
      const results = [];

      for (const keyword of keywords) {
        const response = await axios.get(
          `${this.config.semrush.baseUrl}/keyword_overview/v2`,
          {
            params: {
              key: this.config.semrush.apiKey,
              type: 'phrase_match',
              keyword: keyword,
              database: database,
              display_limit: 10,
            },
          }
        );

        results.push({
          keyword,
          data: response.data,
        });
      }

      return results;
    } catch (error) {
      console.error('SEMrush API error:', error);
      throw error;
    }
  }

  async getSEMrushDomainAnalytics(domain: string, database: string = 'us') {
    if (!this.config.semrush) throw new Error('SEMrush not configured');

    try {
      const response = await axios.get(
        `${this.config.semrush.baseUrl}/domain_overview/v2`,
        {
          params: {
            key: this.config.semrush.apiKey,
            domain: domain,
            database: database,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('SEMrush domain analytics error:', error);
      throw error;
    }
  }

  async getSEMrushBacklinks(domain: string, limit: number = 100) {
    if (!this.config.semrush) throw new Error('SEMrush not configured');

    try {
      const response = await axios.get(
        `${this.config.semrush.baseUrl}/backlinks/v2`,
        {
          params: {
            key: this.config.semrush.apiKey,
            target: domain,
            target_type: 'root_domain',
            display_limit: limit,
            display_sort: 'domain_rating_desc',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('SEMrush backlinks error:', error);
      throw error;
    }
  }

  // Ahrefs Methods
  async getAhrefsKeywordsRating(url: string, mode: string = 'exact') {
    if (!this.config.ahrefs) throw new Error('Ahrefs not configured');

    try {
      const response = await axios.get(
        `${this.config.ahrefs.baseUrl}/keywords/v1/keywords-rating`,
        {
          params: {
            target: url,
            mode: mode,
            limit: 10,
            order_by: 'traffic_desc',
          },
          headers: {
            'Authorization': `Bearer ${this.config.ahrefs.accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Ahrefs keywords rating error:', error);
      throw error;
    }
  }

  async getAhrefsBacklinks(url: string, limit: number = 100) {
    if (!this.config.ahrefs) throw new Error('Ahrefs not configured');

    try {
      const response = await axios.get(
        `${this.config.ahrefs.baseUrl}/backlinks/v1/backlinks`,
        {
          params: {
            target: url,
            mode: 'exact',
            limit: limit,
            order_by: 'domain_rating_desc',
            where: 'http_status:200',
          },
          headers: {
            'Authorization': `Bearer ${this.config.ahrefs.accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Ahrefs backlinks error:', error);
      throw error;
    }
  }

  async getAhrefsSiteMetrics(url: string) {
    if (!this.config.ahrefs) throw new Error('Ahrefs not configured');

    try {
      const response = await axios.get(
        `${this.config.ahrefs.baseUrl}/site/v1/site-explorer-metrics`,
        {
          params: {
            target: url,
            mode: 'domain',
          },
          headers: {
            'Authorization': `Bearer ${this.config.ahrefs.accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Ahrefs site metrics error:', error);
      throw error;
    }
  }

  // Google Search Console Methods
  private async refreshGSCAccessToken() {
    if (!this.config.googleSearchConsole) return;

    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: this.config.googleSearchConsole.clientId,
        client_secret: this.config.googleSearchConsole.clientSecret,
        refresh_token: this.config.googleSearchConsole.refreshToken,
        grant_type: 'refresh_token',
      });

      this.gscAccessToken = response.data.access_token;
    } catch (error) {
      console.error('GSC token refresh error:', error);
      throw error;
    }
  }

  async getGSCAnalytics(startDate: string, endDate: string, dimensions: string[] = ['page']) {
    if (!this.gscAccessToken || !this.config.googleSearchConsole?.siteUrl) {
      throw new Error('Google Search Console not properly configured');
    }

    try {
      const response = await axios.post(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(this.config.googleSearchConsole.siteUrl)}/searchAnalytics/query`,
        {
          startDate,
          endDate,
          dimensions,
          rowLimit: 5000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.gscAccessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('GSC analytics error:', error);
      throw error;
    }
  }

  async getGSCTopQueries(startDate: string, endDate: string) {
    return this.getGSCAnalytics(startDate, endDate, ['query']);
  }

  async getGSCTopPages(startDate: string, endDate: string) {
    return this.getGSCAnalytics(startDate, endDate, ['page']);
  }

  async submitSitemapToGSC(sitemapUrl: string) {
    if (!this.gscAccessToken || !this.config.googleSearchConsole?.siteUrl) {
      throw new Error('Google Search Console not properly configured');
    }

    try {
      const response = await axios.put(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(this.config.googleSearchConsole.siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.gscAccessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('GSC sitemap submission error:', error);
      throw error;
    }
  }

  // Yelp Methods
  async getYelpReviews(businessId: string, limit: number = 20) {
    if (!this.config.yelp) throw new Error('Yelp not configured');

    try {
      const response = await axios.get(
        `https://api.yelp.com/v3/businesses/${businessId}/reviews`,
        {
          params: { limit },
          headers: {
            'Authorization': `Bearer ${this.config.yelp.apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Yelp reviews error:', error);
      throw error;
    }
  }

  async searchYelpBusinesses(term: string, location: string, limit: number = 10) {
    if (!this.config.yelp) throw new Error('Yelp not configured');

    try {
      const response = await axios.get(
        'https://api.yelp.com/v3/businesses/search',
        {
          params: { term, location, limit },
          headers: {
            'Authorization': `Bearer ${this.config.yelp.apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Yelp business search error:', error);
      throw error;
    }
  }

  async getYelpBusinessDetails(businessId: string) {
    if (!this.config.yelp) throw new Error('Yelp not configured');

    try {
      const response = await axios.get(
        `https://api.yelp.com/v3/businesses/${businessId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.yelp.apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Yelp business details error:', error);
      throw error;
    }
  }

  // Houzz Methods
  async createHouzzProject(projectData: {
    title: string;
    description: string;
    images: string[];
    category: string;
    tags: string[];
    location?: string;
  }) {
    if (!this.config.houzz) throw new Error('Houzz not configured');

    try {
      const response = await axios.post(
        `${this.config.houzz.baseUrl}/projects`,
        projectData,
        {
          headers: {
            'Authorization': `Bearer ${this.config.houzz.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Houzz project creation error:', error);
      throw error;
    }
  }

  async uploadToHouzz(imageData: {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    tags: string[];
  }) {
    if (!this.config.houzz) throw new Error('Houzz not configured');

    try {
      const response = await axios.post(
        `${this.config.houzz.baseUrl}/photos`,
        imageData,
        {
          headers: {
            'Authorization': `Bearer ${this.config.houzz.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Houzz photo upload error:', error);
      throw error;
    }
  }

  async getHouzzAnalytics() {
    if (!this.config.houzz) throw new Error('Houzz not configured');

    try {
      const response = await axios.get(
        `${this.config.houzz.baseUrl}/analytics`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.houzz.apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Houzz analytics error:', error);
      throw error;
    }
  }

  // SEO Analysis & Reporting
  async getComprehensiveSEOAnalysis(domain: string) {
    try {
      const analysis = {
        domain: domain,
        semrush: await this.getSEMrushDomainAnalytics(domain),
        ahrefs: await this.getAhrefsSiteMetrics(domain),
        backlinks: {
          semrush: await this.getSEMrushBacklinks(domain, 50),
          ahrefs: await this.getAhrefsBacklinks(domain, 50),
        },
        keywords: {
          semrush: await this.getSEMrushKeywordData(['closet organization', 'custom closets', 'garage storage']),
          ahrefs: await this.getAhrefsKeywordsRating(domain),
        },
        gsc: this.gscAccessToken ? await this.getGSCTopPages(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          new Date().toISOString().split('T')[0]
        ) : null,
      };

      return analysis;
    } catch (error) {
      console.error('SEO analysis error:', error);
      throw error;
    }
  }

  // Reputation Management
  async getReputationScore(businessId: string) {
    try {
      const reputation = {
        yelp: {
          reviews: await this.getYelpReviews(businessId),
          details: await this.getYelpBusinessDetails(businessId),
        },
        averageRating: 0,
        totalReviews: 0,
        sentiment: 'neutral',
      };

      // Calculate aggregate metrics
      const yelpData = reputation.yelp.details;
      if (yelpData.rating) {
        reputation.averageRating = yelpData.rating;
      }
      if (yelpData.review_count) {
        reputation.totalReviews = yelpData.review_count;
      }

      // Determine sentiment based on rating
      if (reputation.averageRating >= 4.5) {
        reputation.sentiment = 'excellent';
      } else if (reputation.averageRating >= 4.0) {
        reputation.sentiment = 'good';
      } else if (reputation.averageRating >= 3.0) {
        reputation.sentiment = 'average';
      } else {
        reputation.sentiment = 'poor';
      }

      return reputation;
    } catch (error) {
      console.error('Reputation score calculation error:', error);
      throw error;
    }
  }

  // Keyword Tracking
  async trackKeywordPositions(keywords: string[], location: string = 'United States') {
    try {
      const trackingData = {
        date: new Date().toISOString(),
        location: location,
        keywords: [],
      };

      for (const keyword of keywords) {
        try {
          const semrushData = await this.getSEMrushKeywordData([keyword]);
          trackingData.keywords.push({
            keyword,
            position: semrushData[0]?.data?.position || 0,
            volume: semrushData[0]?.data?.search_volume || 0,
            difficulty: semrushData[0]?.data?.keyword_difficulty || 0,
            trend: semrushData[0]?.data?.trend || [],
          });
        } catch (error) {
          trackingData.keywords.push({
            keyword,
            position: 0,
            volume: 0,
            difficulty: 0,
            error: error.message,
          });
        }
      }

      return trackingData;
    } catch (error) {
      console.error('Keyword tracking error:', error);
      throw error;
    }
  }

  // Competitor Analysis
  async analyzeCompetitors(competitors: string[]) {
    try {
      const competitorAnalysis = {
        competitors: [],
        comparison: {
          averageDomainRating: 0,
          averageBacklinks: 0,
          averageKeywords: 0,
        },
      };

      let totalDR = 0;
      let totalBacklinks = 0;
      let totalKeywords = 0;

      for (const competitor of competitors) {
        try {
          const analysis = await this.getComprehensiveSEOAnalysis(competitor);
          competitorAnalysis.competitors.push(analysis);

          // Add to totals for comparison
          if (analysis.ahrefs?.domain_rating) {
            totalDR += analysis.ahrefs.domain_rating;
          }
          if (analysis.ahrefs?.referring_domains) {
            totalBacklinks += analysis.ahrefs.referring_domains;
          }
          if (analysis.ahrefs?.organic_keywords) {
            totalKeywords += analysis.ahrefs.organic_keywords;
          }
        } catch (error) {
          competitorAnalysis.competitors.push({
            domain: competitor,
            error: error.message,
          });
        }
      }

      // Calculate averages
      const validCompetitors = competitorAnalysis.competitors.filter(c => !c.error);
      if (validCompetitors.length > 0) {
        competitorAnalysis.comparison.averageDomainRating = totalDR / validCompetitors.length;
        competitorAnalysis.comparison.averageBacklinks = totalBacklinks / validCompetitors.length;
        competitorAnalysis.comparison.averageKeywords = totalKeywords / validCompetitors.length;
      }

      return competitorAnalysis;
    } catch (error) {
      console.error('Competitor analysis error:', error);
      throw error;
    }
  }

  // Content Performance Tracking
  async trackContentPerformance(pages: string[], startDate: string, endDate: string) {
    try {
      const performance = {
        period: { startDate, endDate },
        pages: [],
      };

      for (const page of pages) {
        try {
          const gscData = await this.getGSCAnalytics(startDate, endDate, ['page', 'query']);
          const pageData = gscData.rows?.filter(row => row.keys[0] === page) || [];

          performance.pages.push({
            page,
            clicks: pageData.reduce((sum, row) => sum + row.clicks, 0),
            impressions: pageData.reduce((sum, row) => sum + row.impressions, 0),
            ctr: pageData.reduce((sum, row) => sum + row.ctr, 0) / pageData.length || 0,
            position: pageData.reduce((sum, row) => sum + row.position, 0) / pageData.length || 0,
            topQueries: pageData.slice(0, 5).map(row => ({
              query: row.keys[1],
              clicks: row.clicks,
              impressions: row.impressions,
              position: row.position,
            })),
          });
        } catch (error) {
          performance.pages.push({
            page,
            error: error.message,
          });
        }
      }

      return performance;
    } catch (error) {
      console.error('Content performance tracking error:', error);
      throw error;
    }
  }

  // Webhook Handling
  async handleWebhook(provider: string, payload: any) {
    try {
      switch (provider) {
        case 'yelp':
          return this.handleYelpWebhook(payload);
        case 'houzz':
          return this.handleHouzzWebhook(payload);
        default:
          throw new Error(`Webhook handling for ${provider} not implemented`);
      }
    } catch (error) {
      console.error(`${provider} webhook error:`, error);
      throw error;
    }
  }

  private handleYelpWebhook(payload: any) {
    // Process Yelp webhook events (new reviews, etc.)
    return {
      type: payload.type,
      business_id: payload.business_id,
      event_data: payload.event_data,
      timestamp: payload.timestamp,
    };
  }

  private handleHouzzWebhook(payload: any) {
    // Process Houzz webhook events
    return {
      type: payload.type,
      project_id: payload.project_id,
      event_data: payload.event_data,
      timestamp: payload.timestamp,
    };
  }

  // Error Handling
  handleMarketingError(error: any, platform: string) {
    console.error(`${platform} marketing error:`, error);

    return {
      platform,
      error: true,
      message: error.message || 'Marketing operation failed',
      code: error.code || 'MARKETING_ERROR',
      details: error,
    };
  }
}

// Configuration Helper
export const getMarketingConfig = (): MarketingConfig => {
  return {
    semrush: {
      apiKey: process.env.SEMRUSH_API_KEY!,
      baseUrl: 'https://api.semrush.com',
    },
    ahrefs: {
      accessToken: process.env.AHREFS_ACCESS_TOKEN!,
      baseUrl: 'https://api.ahrefs.com',
    },
    googleSearchConsole: {
      clientId: process.env.GSC_CLIENT_ID!,
      clientSecret: process.env.GSC_CLIENT_SECRET!,
      redirectUri: process.env.GSC_REDIRECT_URI!,
      refreshToken: process.env.GSC_REFRESH_TOKEN!,
      siteUrl: process.env.GSC_SITE_URL,
    },
    yelp: {
      apiKey: process.env.YELP_API_KEY!,
      clientId: process.env.YELP_CLIENT_ID!,
      clientSecret: process.env.YELP_CLIENT_SECRET!,
    },
    houzz: {
      apiKey: process.env.HOUZZ_API_KEY!,
      baseUrl: 'https://api.houzz.com',
    },
  };
};