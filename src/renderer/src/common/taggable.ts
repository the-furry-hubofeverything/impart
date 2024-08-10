export function isTaggableFile(t: Impart.Taggable): t is Impart.TaggableFile {
  return (t as Impart.TaggableFile).file != null
}

export function isTaggableImage(t: Impart.Taggable): t is Impart.TaggableImage {
  return (t as Impart.TaggableImage).image != null
}
