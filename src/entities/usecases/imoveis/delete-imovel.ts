export interface DeleteImovel {
  delete: (userId: string, imovelId: string) => Promise<boolean>
}
