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

interface AtomPosition {
  element: string
  position: [number, number, number]
  wyckoff: string
}

interface CrystalData {
  chemical_formula: string
  space_group: string
  lattice_parameters: LatticeParameters
  atoms: AtomPosition[]
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
        a: this.data.lattice_parameters.a * this.scale,
        b: this.data.lattice_parameters.b * this.scale,
        c: this.data.lattice_parameters.c * this.scale,
        alpha: this.data.lattice_parameters.alpha,
        beta: this.data.lattice_parameters.beta,
        gamma: this.data.lattice_parameters.gamma,
      },
    }
  }

  /**
   * 根据对称性生成所有原子位置
   */
  private generateAtoms(): AtomData[] {
    const atoms: AtomData[] = []

    for (const atom of this.data.atoms) {
      const positions = this.generateSymmetryPositions(atom)
      this.addAtomsFromPositions(atoms, atom.element, positions)
    }

    return atoms
  }

  /**
   * 根据 Wyckoff 位置生成对称等价位置
   */
  private generateSymmetryPositions(atom: AtomPosition): [number, number, number][] {
    const { position } = atom

    if (atom.wyckoff === '8d') {
      return [
        [position[0], position[1], position[2]],
        [-position[0], -position[1], position[2]],
        [0.5 - position[0], 0.5 + position[1], 0.5 - position[2]],
        [0.5 + position[0], 0.5 - position[1], 0.5 - position[2]],
        [-position[0], position[1], -position[2]],
        [position[0], -position[1], -position[2]],
        [0.5 + position[0], 0.5 + position[1], 0.5 + position[2]],
        [0.5 - position[0], 0.5 - position[1], 0.5 + position[2]],
      ]
    } else {
      // 默认处理 4c 位置
      return [
        [position[0], position[1], position[2]],
        [-position[0], -position[1], position[2]],
        [0.5 - position[0], 0.5 + position[1], 0.5 - position[2]],
        [0.5 + position[0], 0.5 - position[1], 0.5 - position[2]],
      ]
    }
  }

  /**
   * 将分数坐标转换为实际坐标并添加到原子列表
   */
  private addAtomsFromPositions(
    atoms: AtomData[],
    element: string,
    positions: [number, number, number][],
  ) {
    const { a, b, c } = this.data.lattice_parameters

    positions.forEach((pos, index) => {
      atoms.push({
        name: `${element}_${index}`,
        element,
        position: [pos[0] * a * this.scale, pos[1] * b * this.scale, pos[2] * c * this.scale] as [
          number,
          number,
          number,
        ],
      })
    })
  }

  /**
   * 将结构中心移到原点
   */
  private centerStructure(atoms: AtomData[]) {
    const { a, b, c } = this.data.lattice_parameters
    const center = {
      x: (a * this.scale) / 2,
      y: (b * this.scale) / 2,
      z: (c * this.scale) / 2,
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
