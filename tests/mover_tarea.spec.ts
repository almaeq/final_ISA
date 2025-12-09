import { test, expect } from '@playwright/test';

// Usamos slowMo para ver la animación del arrastre
test.use({
    launchOptions: {
    slowMo: 700,
    },
});

const BASE_URL = 'http://localhost:23456';

test('Debería mover una tarea de TODO a DOING (Drag and Drop)', async ({ page }) => {
    await page.goto(BASE_URL);

  // --- 1. PREPARACIÓN: Crear la tarea ---
    const idUnico = Date.now();
    const nombreTarea = `Tarea Viajera ${idUnico}`;

    await page.locator('.add-btn').click();
    await page.locator('input[name="title"]').fill(nombreTarea);
    await page.locator('#task-modal button[type="submit"]').click();

  // Localizamos la tarjeta que acabamos de crear
    const tarjeta = page.locator('.task-card').filter({ hasText: nombreTarea }).first();
    await expect(tarjeta).toBeVisible();

  // --- 2. ACCIÓN: Arrastrar y Soltar ---

  // Identificamos el DESTINO (la columna "Doing")
  // En tu index.html, la lista de tareas de Doing tiene el ID "DOING"
    const columnaDoing = page.locator('#DOING');

  // ¡Magia! Arrastramos la tarjeta hacia la columna Doing
    await tarjeta.dragTo(columnaDoing);

  // --- 3. VERIFICACIÓN ---

  // Verificamos que la tarea AHORA está dentro de la columna DOING
  // Buscamos dentro de #doing-column para ver si contiene el texto de nuestra tarea
    await expect(page.locator('#doing-column')).toContainText(nombreTarea);

  // Opcional: Verificar que YA NO está en la columna TODO
    await expect(page.locator('#todo-column')).not.toContainText(nombreTarea);
});