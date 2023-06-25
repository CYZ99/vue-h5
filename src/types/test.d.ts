type Person = {
  name: string
  age: number
}

/**
 * ts 内置泛型工具: Pick<Person, 'age'> 从 Person 取出 age 属性
 */
type PickPerson = Pick<Person, 'age'>

/**
 * ts 内置泛型工具: Omit<Person, 'age'> 排除某些属性
 */
type OmitPerson = Omit<Person, 'age'>
