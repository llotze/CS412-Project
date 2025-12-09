export type Account = {
  id: number
  name: string
  type: string
}

export type Category = {
  id: number
  title: string
}

export type Goal = {
  id: number
  category: number | string
  category_title?: string
  budget_amount: number
  target_amount: number
  deadline: string
}

export type Transaction = {
  id: number
  date: string
  category: number | string
  category_title?: string
  account: number | string
  amount: string
  description: string
}