import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:23456';

test('Debería crear una nueva tarea y mostrarla en TODO', async ({ page }) => {
  // 1. Ir a la página principal
    await page.goto(BASE_URL);

  // 2. Abrir el modal de nueva tarea
    await page.locator('.add-btn').click();

  // 3. Rellenar el formulario
  // Usamos los selectores basados en el "name" de tus inputs HTML
    await page.locator('input[name="title"]').fill('Prueba de Creación');
    await page.locator('textarea[name="description"]').fill('Esta tarea fue creada automáticamente por Playwright');

  // 4. Guardar (Click en el botón dentro del modal)
    await page.locator('#task-modal button[type="submit"]').click();

  // 5. Verificar que aparece en la columna "To Do"
    const todoColumn = page.locator('#todo-column');
    
  // Verificamos que el texto que escribimos ahora existe en la columna
    await expect(todoColumn).toContainText('Prueba de Creación');
});