import { test, expect } from '@playwright/test';

test.use({
  launchOptions: {
    slowMo: 700,
  },
});

const BASE_URL = 'http://localhost:23456';

test('Debería mover una tarea de TODO a DOING (Adaptativo según Navegador)', async ({ page }) => {
  await page.goto(BASE_URL);

  // --- 1. PREPARACIÓN ---
  const idUnico = Date.now();
  const nombreTarea = `Tarea Viajera ${idUnico}`;

  await page.locator('.add-btn').click();
  await page.locator('input[name="title"]').fill(nombreTarea);
  await page.locator('#task-modal button[type="submit"]').click();

  const tarjeta = page.locator('.task-card').filter({ hasText: nombreTarea }).first();
  await expect(tarjeta).toBeVisible();

  // --- 2. ACCIÓN: Arrastrar y Soltar ---
  const columnaDoing = page.locator('#DOING');

  // Detectamos qué navegador está corriendo el test
  const browserType = page.context().browser()?.browserType().name();

  console.log(`Ejecutando estrategia de Drag & Drop para: ${browserType}`);

  if (browserType === 'firefox') {
    // ESTRATEGIA FIREFOX:
    // En tu primer mensaje dijiste que "el test anda en firefox", 
    // así que para Firefox usamos el método nativo que es el más estable para ese motor.
    await tarjeta.dragTo(columnaDoing);
    
  } else {
    // ESTRATEGIA CHROME / WEBKIT:
    // Chrome necesita la simulación manual paso a paso (steps) para disparar
    // los eventos de 'dragover' correctamente.
    const sourceBox = await tarjeta.boundingBox();
    const targetBox = await columnaDoing.boundingBox();

    if (sourceBox && targetBox) {
      // Centro de la tarjeta
      await page.mouse.move(
        sourceBox.x + sourceBox.width / 2, 
        sourceBox.y + sourceBox.height / 2
      );
      await page.mouse.down();
      
      // Movimiento hacia el destino con pasos (CRUCIAL para Chrome)
      await page.mouse.move(
        targetBox.x + targetBox.width / 2, 
        targetBox.y + targetBox.height / 2, 
        { steps: 20 }
      );
      
      await page.mouse.up();
    }
  }

  // Espera de seguridad para la UI
  await page.waitForTimeout(500);

  // --- 3. VERIFICACIÓN ---
  await expect(page.locator('#doing-column')).toContainText(nombreTarea);
  await expect(page.locator('#todo-column')).not.toContainText(nombreTarea);
});