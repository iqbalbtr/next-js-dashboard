import { Schema } from "zod";

export default function validate (schema: Schema, payload: object) {
    return schema.parse(payload)
}