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
    await db.collection('ideas').updateOne({ _id }, { $set: updateData })
    return NextResponse.json({ success: true })
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
    await db.collection('ideas').deleteOne({ _id: id })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
