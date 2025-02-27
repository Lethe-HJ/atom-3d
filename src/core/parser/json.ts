import type { StructureData } from '../components/structures'
import type { AtomData } from '../components/structures/atom'

interface LatticeParameters {
  a: number
  b: number
  c: number
  alpha: number
  beta: number
  gamma: number
}

interface AtomSite {
  species: Array<{
    element: string
    oxidation_state: number | null
    occu: number
  }>
  abc: [number, number, number]
  xyz: [number, number, number]
  label: string
}

interface CrystalData {
  lattice: {
    a: number
    b: number
    c: number
    alpha: number
    beta: number
    gamma: number
  }
  sites: AtomSite[]
}

export class JsonParser {
  private scale: number
  private data: CrystalData

  constructor(data: CrystalData, scale: number = 0.2) {
    this.data = data
    this.scale = scale
  }

  /**
   * 解析晶体数据为三维结构数据
   */
  parse(): StructureData {
    const atoms = this.generateAtoms()
    this.centerStructure(atoms)
    return {
      atoms,
      latticeParameters: {
        a: this.data.lattice.a * this.scale,
        b: this.data.lattice.b * this.scale,
        c: this.data.lattice.c * this.scale,
        alpha: this.data.lattice.alpha,
        beta: this.data.lattice.beta,
        gamma: this.data.lattice.gamma,
      },
    }
  }

  /**
   * 根据对称性生成所有原子位置
   */
  private generateAtoms(): AtomData[] {
    return this.data.sites.map((site, index) => ({
      name: `${site.species[0].element}_${index}`,
      element: site.species[0].element,
      position: [site.xyz[0] * this.scale, site.xyz[1] * this.scale, site.xyz[2] * this.scale] as [
        number,
        number,
        number,
      ],
    }))
  }

  /**
   * 将结构中心移到原点
   */
  private centerStructure(atoms: AtomData[]) {
    const center = {
      x: (this.data.lattice.a * this.scale) / 2,
      y: (this.data.lattice.b * this.scale) / 2,
      z: (this.data.lattice.c * this.scale) / 2,
    }

    atoms.forEach((atom) => {
      atom.position[0] -= center.x
      atom.position[1] -= center.y
      atom.position[2] -= center.z
    })
  }

  /**
   * 静态方法：从JSON文件加载并解析晶体数据
   */
  static async fromFile(url: string, scale?: number): Promise<StructureData> {
    const response = await fetch(url)
    const data = await response.json()
    const parser = new JsonParser(data, scale)
    return parser.parse()
  }
}
