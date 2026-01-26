/* eslint-disable import/no-duplicates */
import type {
  AutoLayoutProps,
  Constraints,
  Layer,
  Rectangle
} from '../types';
import {
  ConstraintHorizontal,
  ConstraintVertical
} from '../types'
/* eslint-enable import/no-duplicates */

export class AutoLayoutCalculator {
  public calculateLayout(frame: Layer, children: Layer[]): { [layerId: string]: Rectangle } {
    if (!frame.autoLayout) {
      // Fallback for non-autolayout frames: just return current positions
      const result: { [id: string]: Rectangle } = {}
      children.forEach(c => {
        result[c.id] = { x: c.x, y: c.y, width: c.width, height: c.height }
      })
      return result
    }

    const props = frame.autoLayout
    const layouts: { [layerId: string]: Rectangle } = {}

    const availableWidth = frame.width - props.padding.left - props.padding.right
    const availableHeight = frame.height - props.padding.top - props.padding.bottom

    if (props.direction === 'horizontal') {
      return this.layoutHorizontal(children, availableWidth, availableHeight, props, layouts)
    } else {
      // Vertical layout logic is symmetric, implementing placeholder
      console.warn(
        'Vertical layout not yet fully implemented, falling back to horizontal logic logic for demo'
      )
      return this.layoutHorizontal(children, availableWidth, availableHeight, props, layouts)
    }
  }

  private layoutHorizontal(
    children: Layer[],
    availableWidth: number,
    availableHeight: number,
    props: AutoLayoutProps,
    layouts: { [id: string]: Rectangle }
  ): any {
    // Step 1: Calculate fixed sizes
    let totalFixedWidth = 0
    const flexibleChildren: Layer[] = []

    for (const child of children) {
      if (child.widthMode === 'fixed') {
        totalFixedWidth += child.width
      } else {
        flexibleChildren.push(child)
      }
    }

    // Account for gaps
    totalFixedWidth += props.gap * Math.max(0, children.length - 1)

    // Step 2: Distribute remaining space to flexible items
    const remainingWidth = Math.max(0, availableWidth - totalFixedWidth)
    const flexibleWidth = flexibleChildren.length > 0 ? remainingWidth / flexibleChildren.length : 0

    // Step 3: Position children left-to-right
    let currentX = props.padding.left

    for (const child of children) {
      const width = child.widthMode === 'fixed' ? child.width : flexibleWidth

      const height = this.calculateVerticalAlignment(child, availableHeight, props.alignItems)

      layouts[child.id] = {
        x: currentX,
        y: props.padding.top, // Simplified Y positioning
        width,
        height,
      }

      currentX += width + props.gap
    }

    return layouts
  }

  private calculateVerticalAlignment(
    child: Layer,
    availableHeight: number,
    alignItems: string
  ): number {
    // Simplified alignment logic
    if (alignItems === 'stretch') return availableHeight
    return child.height
  }
}

export class ConstraintResolver {
  public resolveLayout(
    parentFrame: Rectangle,
    layer: Layer,
    parentLayoutChanged: Rectangle,
    constraints: Constraints
  ): Rectangle {
    const result = { x: layer.x, y: layer.y, width: layer.width, height: layer.height }

    // Horizontal constraints
    switch (constraints.horizontal) {
      case ConstraintHorizontal.LEFT:
        // Pin to left edge, maintain width
        result.x = layer.x
        break

      case ConstraintHorizontal.RIGHT:
        // Pin to right edge, maintain width
        result.x = parentLayoutChanged.width - (parentFrame.width - layer.x - layer.width)
        break

      case ConstraintHorizontal.CENTER:
        // Maintain center position
        result.x = parentLayoutChanged.width / 2 - layer.width / 2
        break

      case ConstraintHorizontal.SCALE:
        // Scale proportionally
        const horizontalRatio = parentLayoutChanged.width / parentFrame.width
        result.width = layer.width * horizontalRatio
        result.x = layer.x * horizontalRatio
        break
    }

    // Vertical constraints (same logic)
    switch (constraints.vertical) {
      case ConstraintVertical.TOP:
        result.y = layer.y
        break
      case ConstraintVertical.BOTTOM:
        result.y = parentLayoutChanged.height - (parentFrame.height - layer.y - layer.height)
        break
      case ConstraintVertical.SCALE:
        const verticalRatio = parentLayoutChanged.height / parentFrame.height
        result.height = layer.height * verticalRatio
        result.y = layer.y * verticalRatio
        break
    }

    return result
  }
}
