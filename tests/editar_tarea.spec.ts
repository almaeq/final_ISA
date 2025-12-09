import { test, expect } from '@playwright/test';

// --- CONFIGURACIÓN DE CÁMARA LENTA ---
// Esto hace que cada acción tarde 1000ms (1 segundo) extra.
test.use({
    launchOptions: {
    slowMo: 1000, 
    },
});

const BASE_URL = 'http://localhost:23456';

test('Debería editar una tarea existente (HTMX Inline Edit)', async ({ page }) => {
    await page.goto(BASE_URL);

  // Ya no usamos números aleatorios, usamos nombres normales
    const tituloOriginal = 'Tarea para Editar';
    const tituloNuevo = 'Tarea Actualizada';

  // --- PREPARACIÓN: Crear la tarea ---
    await page.locator('.add-btn').click();
    await page.locator('input[name="title"]').fill(tituloOriginal);
    await page.locator('#task-modal button[type="submit"]').click();


  // 1. Buscar la tarjeta
  // Agregamos .last() para tomar la ÚLTIMA que se creó (la de abajo del todo).
  // Así nos aseguramos de editar la que acabamos de crear y no una vieja.
    const card = page.locator('.task-card').filter({ hasText: tituloOriginal }).last();
    await expect(card).toBeVisible();

  // 2. Click en Editar
    await card.locator('.edit-btn').click();

  // 3. Modificar el título
    const editInput = page.locator('.task-edit-form input[name="title"]');
    await expect(editInput).toBeVisible();
    
    await editInput.fill(tituloNuevo);
    await page.locator('.save-btn').click();

  // 4. Verificar
    await expect(page.locator('.task-edit-form')).not.toBeVisible();

  // Buscamos la tarjeta con el nuevo nombre.
  // Usamos .first() para que si hay varias, simplemente verifique que al menos UNA existe.
  // Esto evita el error "Strict Mode Violation".
    const tarjetaActualizada = page.locator('.task-card').filter({ hasText: tituloNuevo }).first();
    
    await expect(tarjetaActualizada).toBeVisible();
});