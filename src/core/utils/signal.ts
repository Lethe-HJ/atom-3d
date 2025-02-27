/**
 * 信号处理器类型
 */
type SignalHandler<T> = ((data: T) => void) | (() => void)

interface HandlerWrapper<T> {
  handler: SignalHandler<T>
  once: boolean
}

/**
 * 信号类
 * 用于实现事件发布订阅模式
 */
export class Signal<T = void> {
  private handlers: Set<HandlerWrapper<T>> = new Set()
  private dispatching = false
  private toRemove: Set<HandlerWrapper<T>> = new Set()

  /**
   * 添加信号处理器
   * @param handler 处理器函数
   */
  add(handler: SignalHandler<T>): void {
    this.handlers.add({ handler, once: false })
  }

  /**
   * 添加一次性信号处理器
   * @param handler 处理器函数
   */
  once(handler: SignalHandler<T>): void {
    this.handlers.add({ handler, once: true })
  }

  /**
   * 移除信号处理器
   * @param handler 要移除的处理器函数
   */
  remove(handler: SignalHandler<T>): void {
    for (const wrapper of this.handlers) {
      if (wrapper.handler === handler) {
        if (this.dispatching) {
          this.toRemove.add(wrapper)
        } else {
          this.handlers.delete(wrapper)
        }
        break
      }
    }
  }

  /**
   * 清除所有处理器
   */
  clear(): void {
    if (this.dispatching) {
      this.toRemove = new Set(this.handlers)
    } else {
      this.handlers.clear()
    }
  }

  /**
   * 触发信号
   */
  dispatch(): void
  /**
   * 触发信号
   * @param data 信号数据
   */
  dispatch(data: T): void
  dispatch(data?: T): void {
    this.dispatching = true

    for (const wrapper of this.handlers) {
      if (!this.toRemove.has(wrapper)) {
        if (data !== undefined) {
          ;(wrapper.handler as (data: T) => void)(data)
        } else {
          ;(wrapper.handler as () => void)()
        }

        if (wrapper.once) {
          this.toRemove.add(wrapper)
        }
      }
    }

    this.dispatching = false

    // 清理需要移除的处理器
    if (this.toRemove.size > 0) {
      for (const wrapper of this.toRemove) {
        this.handlers.delete(wrapper)
      }
      this.toRemove.clear()
    }
  }

  /**
   * 是否有处理器
   */
  hasHandlers(): boolean {
    return this.handlers.size > 0
  }
}
