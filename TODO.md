- Better error messages.
  - Location data is appended to all objects, use this to report the failing target and merge op locations.
  - We have validation funcs in merge-props/validation.ts, should extend these to pull the target objects from context.
- Track entity contributors
  - Track what merge ops are used for all finished entities, and record this information on the finished file somehow.
