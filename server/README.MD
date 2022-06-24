```typescript
// Run with transaction
router.get('/test-transaction', async (req, res, next) => {
  const session = await connection.startSession()
  await session.startTransaction()

  await CategoryModel.create([{ name: 'demo', slug: 'demo' }], { session })
  await CategoryModel.create([{ name: 'demo', slug: 'demo2' }], { session })

  await session.abortTransaction()

  await session.endSession()

  const category = await CategoryModel.findOne({ name: 'demo' })

  res.json(category)
})
```