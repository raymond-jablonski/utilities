const metadataSymbol = Symbol()
const tagsSymbol = Symbol()

export function storeMetadata(obj, ...metadatas) {
    let metadata = obj[metadataSymbol] || {}

    for (let data of metadatas) {
        if (typeof(data) === 'object' && !Array.isArray(data)) {
            metadata = Object.assign({}, metadata, data)
        } 
    }

    obj[metadataSymbol] = metadata
    return obj
}

export function getMetadata(obj) {
    return obj[metadataSymbol] || {}
}

export function clearMetadata(obj) {
    delete obj[metadataSymbol]
}

export function addTags(obj, ...newTags) { 
    let tagsSet = obj[tagsSymbol] || new Set()
    for (let tag of newTags) {
        if (Array.isArray(tag)) {
            for (let t of tag) {
                tagsSet.add(t)
            }
        } else {
            tagsSet.add(tag)
        }
    }
    obj[tagsSymbol] = tagsSet
    return obj
}

export function clearTags(obj) {
    delete obj[tagsSymbol]
}

export function getTags(obj) {
    return Array.from(obj[tagsSymbol] || new Set())
}

export function hasTag(obj, tag) {
    let tags = obj[tagsSymbol] || new Set()
    return tags.has(tag)
}

export function removeTags(obj, ...tags) {
    let newTags = obj[tagsSymbol] || new Set()
    for (let tag of tags) {
        newTags.delete(tag)
    }

    obj[tagsSymbol] = newTags
    return obj
}