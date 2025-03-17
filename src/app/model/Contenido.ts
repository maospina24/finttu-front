export class Contenido {
  constructor(
    public id: number,
    public tipo: string,
    public description: string,
    public seccioId?: any,
    public categoria?: any,
    public cuotaMensual: boolean = false,
    public estado: boolean = true,
    public valor: any = null,
    public valorCuota: any = null
  ) {}
}
