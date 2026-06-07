import { test, expect } from '@playwright/test';

test.describe('Resume page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Header & Title', () => {
    test('page loads with correct title', async ({ page }) => {
      await expect(page).toHaveTitle(/Adrian Go Militante/);
    });

    test('header has correct structure', async ({ page }) => {
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // Check for main heading
      const heading = header.locator('h1');
      await expect(heading).toHaveText('Adrian Go Militante');
      
      // Check for role subtitle
      const role = header.locator('p').filter({ hasText: 'Senior Test Automation Engineer' });
      await expect(role).toBeVisible();
    });

    test('shows name and role in header', async ({ page }) => {
      await expect(page.getByText('Adrian Go Militante').first()).toBeVisible();
      await expect(page.getByText('Senior Test Automation Engineer').first()).toBeVisible();
    });

    test('shows location with pin icon', async ({ page }) => {
      const locationPill = page.locator('header').getByText('Singapore');
      await expect(locationPill).toBeVisible();
    });
  });

  test.describe('Links Validation', () => {
    test('LinkedIn link is valid', async ({ page }) => {
      const linkedinLink = page.locator('a[href*="linkedin.com/in/adrianmilitante"]');
      
      // Check link exists
      await expect(linkedinLink).toHaveCount(1); // Header only, Footer was removed due to redundancy.
      
      // Check href format
      const href = await linkedinLink.first().getAttribute('href');
      expect(href).toMatch(/^https:\/\/www\.linkedin\.com\/in\/adrianmilitante$/);
      
      // Check target and rel attributes for security
      await expect(linkedinLink.first()).toHaveAttribute('target', '_blank');
      await expect(linkedinLink.first()).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('all external links have security attributes', async ({ page }) => {
      const externalLinks = page.locator('a[target="_blank"]');
      const count = await externalLinks.count();
      
      expect(count).toBeGreaterThan(0);
      
      // Verify each external link has rel="noopener noreferrer"
      for (let i = 0; i < count; i++) {
        const rel = await externalLinks.nth(i).getAttribute('rel');
        expect(rel).toBe('noopener noreferrer');
      }
    });

    test('no broken anchor links in main content', async ({ page }) => {
      const links = page.locator('a');
      const count = await links.count();
      
      // Should have at least LinkedIn link
      expect(count).toBeGreaterThanOrEqual(2);
      
      // Check no empty hrefs
      for (let i = 0; i < count; i++) {
        const href = await links.nth(i).getAttribute('href');
        expect(href).not.toBe('');
        expect(href).not.toBe('#');
      }
    });

    test('LinkedIn link text is visible', async ({ page }) => {
      const linkedinText = page.locator('a[href*="linkedin.com"]').getByText('LinkedIn').first();
      await expect(linkedinText).toBeVisible();
    });
  });

  test.describe('Section Structure', () => {
    test('has all major sections', async ({ page }) => {
      const sections = ['Profile', 'Technical Skills', 'Professional Experience', 'Education', 'Certifications'];
      
      for (const section of sections) {
        await expect(page.getByText(section)).toBeVisible();
      }
    });

    test('sections have proper heading hierarchy', async ({ page }) => {
      const h1 = page.locator('h1');
      const h2Sections = page.locator('h2.uppercase');
      
      // Should have one h1 (Adrian Go Militante)
      await expect(h1).toHaveCount(1);
      
      // Should have multiple h2 sections
      const h2Count = await h2Sections.count();
      expect(h2Count).toBeGreaterThanOrEqual(5);
    });

    test('main content is not empty', async ({ page }) => {
      const main = page.locator('main');
      await expect(main).not.toBeEmpty();
      const text = await main.innerText();
      expect(text.length).toBeGreaterThan(500);
    });
  });

  test.describe('Readability & Typography', () => {
    test('body has readable font', async ({ page }) => {
      const body = page.locator('body');
      const fontFamily = await body.evaluate((el) => window.getComputedStyle(el).fontFamily);
      
      // Should use Inter font family
      expect(fontFamily).toContain('Inter');
    });

    test('content has adequate contrast', async ({ page }) => {
      // Check main content text color
      const mainText = page.locator('main p').first();
      const color = await mainText.evaluate((el) => window.getComputedStyle(el).color);
      
      // Should not be white or very light (should have contrast with white background)
      expect(color).not.toBe('rgb(255, 255, 255)');
    });

    test('headings are visibly larger than body text', async ({ page }) => {
      const heading = page.locator('main h3').first();
      const paragraph = page.locator('main p').first();
      
      const headingSize = await heading.evaluate((el) => parseInt(window.getComputedStyle(el).fontSize));
      const paraSize = await paragraph.evaluate((el) => parseInt(window.getComputedStyle(el).fontSize));
      
      // Heading should be noticeably larger
      expect(headingSize).toBeGreaterThan(paraSize);
    });

    test('line height is readable', async ({ page }) => {
      const paragraph = page.locator('main p').first();
      const lineHeight = await paragraph.evaluate((el) => window.getComputedStyle(el).lineHeight);
      
      // Should have reasonable line height
      expect(lineHeight).not.toBe('normal');
    });

    test('has no overflowing content', async ({ page }) => {
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
    });

    test('skills are displayed as readable pills', async ({ page }) => {
      const skillPills = page.locator('span.rounded-full');
      const count = await skillPills.count();
      
      // Should have many skill pills
      expect(count).toBeGreaterThan(10);
      
      // Each pill should be visible and have text
      for (let i = 0; i < Math.min(5, count); i++) {
        const pill = skillPills.nth(i);
        await expect(pill).toBeVisible();
        const text = await pill.innerText();
        expect(text.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Layout & Responsiveness', () => {
    test('has no broken layout (body renders content)', async ({ page }) => {
      const body = page.locator('body');
      await expect(body).not.toBeEmpty();
      const text = await body.innerText();
      expect(text.length).toBeGreaterThan(500);
    });

    test('page is centered with max-width', async ({ page }) => {
      const mainElement = page.locator('main');
      const classes = await mainElement.getAttribute('class');
      
      // Should have max-width constraint
      expect(classes).toContain('max-w');
    });

    test('footer is visible with links', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      
      // Footer should have at least name and one link
      const name = footer.getByText('Adrian Go Militante');
      await expect(name).toBeVisible();
    });
  });

  test.describe('Data Accuracy', () => {
    test('shows Singapore location consistently', async ({ page }) => {
      const singaporeElements = page.getByText('Singapore');
      const count = await singaporeElements.count();
      
      // Should appear multiple times (header, footer, etc)
      expect(count).toBeGreaterThanOrEqual(2);
    });

    test('experience section has company and role', async ({ page }) => {
      const experienceSection = page.locator('main').getByText('Professional Experience').first();
      const experienceContainer = experienceSection.locator('..').locator('..');
      
      const companies = ['WS Audiology', 'Continental', 'Gemalto', 'Rohm'];
      
      for (const company of companies) {
        const element = experienceContainer.getByText(company).first();
        await expect(element).toBeVisible();
      }
    });

    test('certifications are displayed', async ({ page }) => {
      const certSection = page.getByText('Certifications');
      await expect(certSection).toBeVisible();
      
      // Should have ISTQB certification visible in the certifications section
      const certContainer = certSection.locator('..').locator('..');
      const istqb = certContainer.locator('span:has-text("ISTQB")').first();
      await expect(istqb).toBeVisible();
    });
  });
});
