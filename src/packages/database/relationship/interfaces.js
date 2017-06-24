/* @flow */

import type { Model } from '../index'

type RelationshipType = 'belongsTo' | 'hasMany' | 'hasOne'

type Relationship$ref = Model | Array<Model>

export type Relationship$refs = WeakMap<Model, Map<string, Relationship$ref>>

export type Relationship$opts = {
  type: RelationshipType,
  model: Class<Model>,
  inverse: string,
  through?: Class<Model>,
  foreignKey: string,
}
