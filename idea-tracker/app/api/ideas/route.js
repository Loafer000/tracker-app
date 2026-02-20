import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('ideaTracker')
    const ideas = await db.collection('ideas').find({}).sort({ date: -1, _id: -1 }).toArray()
    return NextResponse.json(ideas)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db('ideaTracker')
    const body = await request.json()
    const result = await db.collection('ideas').insertOne(body)
    return NextResponse.json({ ...body, _id: result.insertedId })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const client = await clientPromise
    const db = client.db('ideaTracker')
    const body = await request.json()
    const { _id, ...updateData } = body
    const result = await db.collection('ideas').replaceOne({ _id }, { _id, ...updateData })
    return NextResponse.json({ success: true, modified: result.modifiedCount })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const client = await clientPromise
    const db = client.db('ideaTracker')
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const result = await db.collection('ideas').deleteOne({ _id: id })
    return NextResponse.json({ success: true, deleted: result.deletedCount })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
