import { ComponentDefinition, ComponentInstance, Layer } from '../types'

export class ComponentResolver {
  private components: Map<string, ComponentDefinition> = new Map()
  private instances: Map<string, ComponentInstance> = new Map()

  constructor(initialComponents: ComponentDefinition[] = []) {
    initialComponents.forEach(c => this.components.set(c.id, c))
  }

  public registerComponent(component: ComponentDefinition) {
    this.components.set(component.id, component)
  }

  public registerInstance(instance: ComponentInstance) {
    this.instances.set(instance.id, instance)
  }

  // Helper to find a layer in a recursive tree
  private findLayer(layers: Layer[], layerId: string): Layer | undefined {
    for (const layer of layers) {
      if (layer.id === layerId) return layer
      if (layer.children) {
        const found = this.findLayer(layer.children, layerId)
        if (found) return found
      }
    }
    return undefined
  }

  // TRANSITIVE RESOLUTION: Chain of variable references
  public resolveValue(
    layerId: string,
    propertyKey: keyof Layer,
    componentInstance: ComponentInstance
  ): any {
    // Step 1: Check for instance override
    if (componentInstance.overrides && componentInstance.overrides.has(layerId)) {
      const override = componentInstance.overrides.get(layerId)
      if (override && override[propertyKey] !== undefined) {
        return override[propertyKey]
      }
    }

    // Step 2: Get main component
    const mainComponent = this.components.get(componentInstance.componentId)
    if (!mainComponent) {
      console.warn(`Component ${componentInstance.componentId} not found`)
      return null
    }

    const layer = this.findLayer(mainComponent.layers, layerId)
    if (!layer) {
      console.warn(`Layer ${layerId} not found in component ${mainComponent.id}`)
      return null
    }

    // Step 3: Resolve through variable chain (Simulated)
    // In a full implementation, we would traverse a variable map.
    // For now, we return the base layer property.

    // Casting to any to access dynamic property key
    return (layer as any)[propertyKey]
  }

  // PARAMETER CHANGE PROPAGATION
  public updateComponentProperty(componentId: string, propertyKey: string, newValue: any) {
    const mainComponent = this.components.get(componentId)
    if (!mainComponent) return

    if (mainComponent.properties[propertyKey]) {
      mainComponent.properties[propertyKey].value = newValue
    }

    // INVALIDATION: Find all instances that use this component
    // In a real app we'd use a reverse index or iterate
    const affectedInstances = Array.from(this.instances.values()).filter(
      inst => inst.componentId === componentId
    )

    // RE-RESOLUTION
    for (const instance of affectedInstances) {
      this.invalidateAndResolveInstance(instance)
    }
  }

  private invalidateAndResolveInstance(instance: ComponentInstance) {
    // Clear computed cache
    // (instance as any)['_computedCache'] = {};
    console.log(`Invalidating instance ${instance.id}`)
    // Trigger re-render in UI
  }
}
