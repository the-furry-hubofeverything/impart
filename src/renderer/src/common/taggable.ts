export function isTaggableImage(t: Impart.Taggable): t is Impart.TaggableImage {
  return (t as Impart.TaggableImage).dimensions != null
}

export function isTaggableFile(t: Impart.Taggable): t is Impart.TaggableFile {
  return !isTaggableImage(t)
}
