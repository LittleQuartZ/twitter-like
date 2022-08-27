import type { AppRouter } from '@/server/routers/_app'
import type { NextApiRequest, NextApiResponse } from 'next'

import Cors from 'cors'
import { createTRPCClient } from '@trpc/client'
import { getBaseUrl } from '@/pages/_app'

const cors = Cors({
  methods: ['GET'],
})

const client = createTRPCClient<AppRouter>({
  url: `${getBaseUrl()}/api/trpc`,
})

// Middleware for cors
const middleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await middleware(req, res, cors)

  const { uuid } = req.query
  const user = await client.query('user.byId', { id: uuid as string })

  return res.status(200).json(user)
}

export default handler
