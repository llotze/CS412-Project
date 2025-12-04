export type Account = {
  id: number
  name: string
  type: string
  balance: string
}

export type Category = {
  id: number
  title: string
  budget_amount: number
}

export type Goal = {
  id: number
  category: number | string
  category_title?: string
  target_amount: number
  deadline: string
}

export type Transaction = {
  id: number
  date: string
  category: number | string
  category_title?: string
  amount: string
  description: string
}