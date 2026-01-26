import { v4 as uuidv4 } from 'uuid'

export interface PropertyChange {
  objectId: string
  propertyKey: string
  value: any
  clientId: string
  timestamp: number
  serverSequenceNumber: number
}

export interface DocumentState {
  [objectId: string]: {
    [propertyKey: string]: {
      value: any
      lastSequenceNumber: number
    }
  }
}

export class MultiplayerEngine {
  private serverState: DocumentState = {}
  private unacknowledgedChanges: PropertyChange[] = []
  private clientId: string
  // simplified WebSocket for demo purposes - in a real app this would be a real WebSocket connection
  private websocket: {
    send: (data: string) => void
    onmessage?: (event: { data: string }) => void
  } | null = null
  private listeners: ((state: DocumentState) => void)[] = []

  constructor(clientId?: string, _websocketUrl: string = 'wss://figma-multiplayer.example.com') {
    this.clientId = clientId || uuidv4()
    // Stubbing WebSocket for now since we don't have a real backend
    if (typeof WebSocket !== 'undefined') {
      try {
        // this.websocket = new WebSocket(websocketUrl);
        // this.setupMessageHandling();
        console.log('WebSocket stubbed for visual configurator')
      } catch (e) {
        console.warn('WebSocket connection failed, running in offline mode')
      }
    }
  }

  public subscribe(listener: (state: DocumentState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(l => l(this.serverState))
  }

  // Client sends edit to server
  public applyLocalChange(objectId: string, prop: string, value: any) {
    const change: PropertyChange = {
      objectId,
      propertyKey: prop,
      value,
      clientId: this.clientId,
      timestamp: Date.now(),
      serverSequenceNumber: 0, // Will be assigned by server
    }

    // Apply IMMEDIATELY on client for responsiveness
    this.applyChangeLocally(change)

    // Track as unacknowledged
    this.unacknowledgedChanges.push(change)

    // Send to server (Stubbed)
    if (this.websocket) {
      this.websocket.send(
        JSON.stringify({
          type: 'edit',
          change,
        })
      )
    } else {
      // Simulate server ack for offline dev mode
      setTimeout(() => {
        this.onChangeAcknowledged(Date.now()) // simplified seq num
      }, 50)
    }
  }

  // Server applies all edits with LWW (Last-Writer-Wins)
  public applyServerChange(incomingChange: PropertyChange) {
    const objectId = incomingChange.objectId
    const prop = incomingChange.propertyKey

    // Initialize object if doesn't exist
    if (!this.serverState[objectId]) {
      this.serverState[objectId] = {}
    }

    // Check if this is newer than current value
    const currentProperty = this.serverState[objectId][prop]

    if (
      !currentProperty ||
      incomingChange.serverSequenceNumber > currentProperty.lastSequenceNumber
    ) {
      // CONFLICT RESOLUTION: Keep the latest
      this.serverState[objectId][prop] = {
        value: incomingChange.value,
        lastSequenceNumber: incomingChange.serverSequenceNumber,
      }
      this.notifyListeners()
    }
    // Otherwise ignore older change (Last-Writer-Wins)
  }

  // Handle incoming changes from server (called when WebSocket is set up)
  public setupMessageHandling() {
    if (!this.websocket) return

    this.websocket.onmessage = event => {
      try {
        const message = JSON.parse(event.data)

        if (message.type === 'update') {
          // Broadcast of other users' changes
          if (Array.isArray(message.changes)) {
            message.changes.forEach((change: PropertyChange) => {
              this.handleIncomingServerChange(change)
            })
          }
        }
      } catch (e) {
        console.error('Failed to parse websocket message', e)
      }
    }
  }

  // CRITICAL: Avoid flickering on conflict
  private handleIncomingServerChange(change: PropertyChange) {
    const objectId = change.objectId
    const prop = change.propertyKey

    // Check if WE have an unacknowledged change for same property
    const ourUnackChange = this.unacknowledgedChanges.find(
      c => c.objectId === objectId && c.propertyKey === prop
    )

    if (ourUnackChange) {
      // IGNORE incoming change if we have a pending local change
      // We show our local change as "best prediction"
      return
    }

    // Otherwise, apply the server's change
    this.applyServerChange(change)
  }

  // On acknowledgment from server
  public onChangeAcknowledged(sequenceNumber: number) {
    // Remove from unacknowledged list
    this.unacknowledgedChanges = this.unacknowledgedChanges.filter(
      c => c.serverSequenceNumber !== sequenceNumber
    )
  }

  private applyChangeLocally(change: PropertyChange) {
    // In a real app, this updates the visual tree directly
    // For this engine, we update the state so subscribers see it
    const objectId = change.objectId
    const prop = change.propertyKey

    if (!this.serverState[objectId]) {
      this.serverState[objectId] = {}
    }

    // Optimistically update
    this.serverState[objectId][prop] = {
      value: change.value,
      lastSequenceNumber: change.serverSequenceNumber,
    }

    this.notifyListeners()
  }

  public getState() {
    return this.serverState
  }
}
