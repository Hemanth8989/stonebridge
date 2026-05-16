import type { Page, Locator } from '@playwright/test';

export interface SlabFormData {
  materialType?:  string;
  materialName?:  string;
  colorFamily?:   string;
  thicknessCm?:   number;
  finish?:        string;
  grossLengthMm?: number;
  grossWidthMm?:  number;
  priceOverride?: number;
  rackLocation?:  string;
  qualityGrade?:  string;
  isRemnant?:     boolean;
  internalRef?:   string;
  lotNumber?:     string;
}

export class SupplierInventoryNewPage {
  readonly url = 'http://localhost:5174/inventory/new';

  readonly materialTypeSelect: Locator;
  readonly materialNameInput:  Locator;
  readonly colorFamilySelect:  Locator;
  readonly thicknessInput:     Locator;
  readonly finishSelect:       Locator;
  readonly grossLengthInput:   Locator;
  readonly grossWidthInput:    Locator;
  readonly priceOverrideInput: Locator;
  readonly rackLocationInput:  Locator;
  readonly qualityGradeSelect: Locator;
  readonly internalRefInput:   Locator;
  readonly lotNumberInput:     Locator;
  readonly isRemnantCheckbox:  Locator;

  readonly submitButton:       Locator;
  readonly cancelButton:        Locator;
  readonly formError:           Locator;

  constructor(private readonly page: Page) {
    this.materialTypeSelect = page.getByLabel(/material type/i);
    this.materialNameInput  = page.getByLabel(/material name/i);
    this.colorFamilySelect  = page.getByLabel(/color/i);
    this.thicknessInput     = page.getByLabel(/thickness/i);
    this.finishSelect       = page.getByLabel(/finish/i);
    this.grossLengthInput   = page.getByLabel(/gross length|length \(mm\)/i);
    this.grossWidthInput    = page.getByLabel(/gross width|width \(mm\)/i);
    this.priceOverrideInput = page.getByLabel(/price/i);
    this.rackLocationInput  = page.getByLabel(/rack/i);
    this.qualityGradeSelect = page.getByLabel(/grade/i);
    this.internalRefInput   = page.getByLabel(/internal ref|reference/i);
    this.lotNumberInput     = page.getByLabel(/lot number/i);
    this.isRemnantCheckbox  = page.getByLabel(/remnant/i);
    this.submitButton       = page.getByRole('button', { name: /save|create|add slab/i });
    this.cancelButton       = page.getByRole('button', { name: /cancel|back/i });
    this.formError          = page.getByRole('alert');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async fillForm(data: SlabFormData): Promise<void> {
    if (data.materialType  !== undefined) await this.materialTypeSelect.selectOption(data.materialType);
    if (data.materialName  !== undefined) await this.materialNameInput.fill(data.materialName);
    if (data.colorFamily   !== undefined) await this.colorFamilySelect.selectOption(data.colorFamily);
    if (data.thicknessCm   !== undefined) await this.thicknessInput.fill(String(data.thicknessCm));
    if (data.finish        !== undefined) await this.finishSelect.selectOption(data.finish);
    if (data.grossLengthMm !== undefined) await this.grossLengthInput.fill(String(data.grossLengthMm));
    if (data.grossWidthMm  !== undefined) await this.grossWidthInput.fill(String(data.grossWidthMm));
    if (data.priceOverride !== undefined) await this.priceOverrideInput.fill(String(data.priceOverride));
    if (data.rackLocation  !== undefined) await this.rackLocationInput.fill(data.rackLocation);
    if (data.qualityGrade  !== undefined) await this.qualityGradeSelect.selectOption(data.qualityGrade);
    if (data.internalRef   !== undefined) await this.internalRefInput.fill(data.internalRef);
    if (data.lotNumber     !== undefined) await this.lotNumberInput.fill(data.lotNumber);
    if (data.isRemnant === true)  await this.isRemnantCheckbox.check();
    if (data.isRemnant === false) await this.isRemnantCheckbox.uncheck();
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async submitAndExpectSuccess(): Promise<void> {
    await Promise.all([
      this.page.waitForURL('**/inventory'),
      this.submitButton.click(),
    ]);
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await this.page.waitForURL('**/inventory');
  }
}
