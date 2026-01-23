export interface Layer {
  id: string
  type: 'FRAME' | 'TEXT' | 'RECTANGLE' | 'COMPONENT' | 'INSTANCE'
  name: string
  x: number
  y: number
  width: number
  height: number
  widthMode?: 'fixed' | 'fill' | 'hug'
  heightMode?: 'fixed' | 'fill' | 'hug'
  fills: Fill[]
  children?: Layer[]
  parentId?: string
  // Component specific
  componentId?: string
  overrides?: Map<string, any>
  // Frame specific
  autoLayout?: AutoLayoutProps
  constraints?: Constraints
  cornerRadius?: number
  opacity?: number
}

export interface Fill {
  type: 'SOLID' | 'IMAGE' | 'GRADIENT'
  color?: string
  opacity?: number
}

export interface AutoLayoutProps {
  direction: 'horizontal' | 'vertical'
  gap: number
  padding: { top: number; right: number; bottom: number; left: number }
  itemSpacing: 'packed' | 'distributed' | 'space-between'
  alignItems: 'start' | 'center' | 'end' | 'stretch'
}

export enum ConstraintHorizontal {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
  SCALE = 'scale',
}

export enum ConstraintVertical {
  TOP = 'top',
  CENTER = 'center',
  BOTTOM = 'bottom',
  SCALE = 'scale',
}

export interface Constraints {
  horizontal: ConstraintHorizontal
  vertical: ConstraintVertical
}

export interface ComponentDefinition {
  id: string
  mainComponent: boolean
  properties: {
    [key: string]: {
      type: 'boolean' | 'text' | 'number' | 'select'
      value: any
      options?: string[]
    }
  }
  layers: Layer[]
}

export interface ComponentInstance {
  id: string
  componentId: string
  overrides: Map<string, any> // layerId -> property overrides
}

export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}
