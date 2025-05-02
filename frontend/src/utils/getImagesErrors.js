export default function getImagesErrors (data) {
  let errors = [];
  if ('images.0' in data) {
    errors = [...errors, ...data['images.0']]
  }
  if ('images.1' in data) {
    errors = [...errors, ...data['images.1']]
  }
  if ('images.2' in data) {
    errors = [...errors, ...data['images.2']]
  }
  if ('images.3' in data) {
    errors = [...errors, ...data['images.3']]
  }
  if ('images.4' in data) {
    errors = [...errors, ...data['images.4']]
  }
  return errors;
}