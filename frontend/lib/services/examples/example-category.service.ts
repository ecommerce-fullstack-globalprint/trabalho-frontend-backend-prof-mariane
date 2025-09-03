import { CrudBaseService } from '../abstractions';

// ===== TIPOS PARA O EXEMPLO =====
interface Category {
  id: number;
  name: string;
  description: string;
  parent_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateCategoryRequest {
  name: string;
  description: string;
  parent_id?: number;
}

/**
 * Exemplo de como criar um novo serviço usando as abstrações
 * Este serviço demonstra todas as funcionalidades disponíveis
 */
export class ExampleCategoryService extends CrudBaseService<Category> {
  protected baseEndpoint = '/api/v1/categories/';

  // ===== MÉTODOS CRUD BÁSICOS =====
  // Usando as abstrações - código mínimo necessário

  public async getCategories(filters?: { name?: string; is_active?: boolean; parent_id?: number }) {
    return this.getAll(filters);
  }

  public async getCategory(id: number) {
    return this.getById(id);
  }

  public async createCategory(categoryData: CreateCategoryRequest) {
    return this.create(categoryData);
  }

  public async updateCategory(id: number, categoryData: Partial<CreateCategoryRequest>) {
    return this.update(id, categoryData);
  }

  public async deleteCategory(id: number) {
    return this.delete(id);
  }

  // ===== AÇÕES CUSTOMIZADAS USANDO performAction =====
  
  /**
   * Ativa uma categoria
   * Equivale a: PATCH /api/v1/categories/{id}/activate/
   */
  public async activateCategory(id: number) {
    return this.performAction<Category>(id, 'activate', {}, 'PATCH');
  }

  /**
   * Desativa uma categoria
   * Equivale a: PATCH /api/v1/categories/{id}/deactivate/
   */
  public async deactivateCategory(id: number) {
    return this.performAction<Category>(id, 'deactivate', {}, 'PATCH');
  }

  /**
   * Move uma categoria para outro pai
   * Equivale a: PATCH /api/v1/categories/{id}/move/
   */
  public async moveCategory(id: number, newParentId: number) {
    return this.performAction<Category>(id, 'move', { parent_id: newParentId }, 'PATCH');
  }

  /**
   * Obtém subcategorias de uma categoria
   * Equivale a: GET /api/v1/categories/{id}/children/
   */
  public async getCategoryChildren(id: number) {
    return this.performAction<Category[]>(id, 'children', {}, 'GET');
  }

  // ===== AÇÕES EM COLEÇÕES USANDO performCollectionAction =====

  /**
   * Reordena todas as categorias
   * Equivale a: POST /api/v1/categories/reorder/
   */
  public async reorderCategories(categoryIds: number[]) {
    return this.performCollectionAction('reorder', { order: categoryIds });
  }

  /**
   * Importa categorias de um arquivo
   * Equivale a: POST /api/v1/categories/import/
   */
  public async importCategories(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Para upload de arquivos, usamos diretamente a API
    const response = await this.api.post(`${this.baseEndpoint}import/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Obtém estatísticas das categorias
   * Equivale a: GET /api/v1/categories/stats/
   */
  public async getCategoryStats() {
    return this.performCollectionAction('stats', {}, 'GET');
  }

  // ===== MÉTODO COMPLEXO COMBINANDO VÁRIAS OPERAÇÕES =====

  /**
   * Reorganiza uma categoria e seus filhos
   * Este método demonstra como combinar várias operações
   */
  public async reorganizeCategoryTree(
    categoryId: number, 
    newParentId?: number, 
    newChildrenOrder?: number[]
  ) {
    const category = await this.getById(categoryId);
    
    // Move a categoria se necessário
    if (newParentId && category.parent_id !== newParentId) {
      await this.moveCategory(categoryId, newParentId);
    }

    // Reordena os filhos se necessário
    if (newChildrenOrder) {
      await this.reorderCategories(newChildrenOrder);
    }

    // Retorna a categoria atualizada
    return this.getById(categoryId);
  }
}

// ===== EXEMPLO DE USO =====

export const categoryServiceExample = async () => {
  const categoryService = new ExampleCategoryService();

  try {
    // Buscar todas as categorias ativas
    const activeCategories = await categoryService.getCategories({ is_active: true });
    console.log('Categorias ativas:', activeCategories);

    // Criar nova categoria
    const newCategory = await categoryService.createCategory({
      name: 'Nova Categoria',
      description: 'Descrição da categoria'
    });
    console.log('Categoria criada:', newCategory);

    // Ativar a categoria
    const activatedCategory = await categoryService.activateCategory(newCategory.id);
    console.log('Categoria ativada:', activatedCategory);

    // Buscar filhos de uma categoria
    const children = await categoryService.getCategoryChildren(1);
    console.log('Subcategorias:', children);

    // Reorganizar árvore de categorias
    await categoryService.reorganizeCategoryTree(newCategory.id, 1, [2, 3, 4]);
    console.log('Árvore reorganizada');

  } catch (error) {
    console.error('Erro:', error);
  }
};

// ===== COMPARAÇÃO: ANTES vs DEPOIS =====

/**
 * ANTES (sem abstrações) - cada método precisaria ser escrito completo:
 * 
 * public async getCategories(filters?: any) {
 *   const response = await this.api.get('/api/v1/categories/', { params: filters });
 *   return response.data;
 * }
 * 
 * public async getCategory(id: number) {
 *   const response = await this.api.get(`/api/v1/categories/${id}/`);
 *   return response.data;
 * }
 * 
 * public async activateCategory(id: number) {
 *   const response = await this.api.patch(`/api/v1/categories/${id}/activate/`);
 *   return response.data;
 * }
 * 
 * // ... 15+ métodos repetindo o mesmo padrão
 */

/**
 * DEPOIS (com abstrações) - código conciso e focado na lógica de negócio:
 * 
 * public async getCategories(filters?: any) {
 *   return this.getAll(filters);
 * }
 * 
 * public async getCategory(id: number) {
 *   return this.getById(id);
 * }
 * 
 * public async activateCategory(id: number) {
 *   return this.performAction(id, 'activate', {}, 'PATCH');
 * }
 * 
 * // Redução de ~70% no código boilerplate
 */
