const request = {}

request.post = function (url, obj) {
  return this.$http.post(url, obj)
    .then(({status, body, code}) => {
      if (status === 200) {
        return body
      } else {
        throw new Error(`服务器出现错误！status:${status},code:${code},url:${url}`)
      }
    })
    .catch(err => {
      throw new Error(err)
    })
}

request.$paramsPost = function (url, obj, params) {
  return this.$http.post(url, obj, {params})
    .then(({status, body, code}) => {
      if (status === 200) {
        return body
      } else {
        throw new Error(`服务器出现错误！status:${status},code:${code},url:${url}`)
      }
    })
    .catch(err => {
      throw new Error(err)
    })
}

request.$filterPost = function (url, obj, filter) {
  return this.$http.post(url, obj, {params: {where: filter}})
    .then(({status, body, code}) => {
      if (status === 200) {
        return body
      } else {
        throw new Error(`服务器出现错误！status:${status},code:${code},url:${url}`)
      }
    })
    .catch(err => {
      throw new Error(err)
    })
}

request.$get = function (url) {
  return this.$http.get(url)
    .then(({status, body, code}) => {
      if (status === 200) {
        return body
      } else {
        throw new Error(`服务器出现错误！status:${status},code:${code},url:${url}`)
      }
    })
    .catch(err => {
      throw new Error(err)
    })
}

request.$delete = function (url) {
  return this.$http.delete(url)
  .then(({status, body, code}) => {
    if (status === 200) {
      return body
    } else {
      throw new Error(`服务器出现错误！status:${status},code:${code},url:${url}`)
    }
  })
  .catch(err => {
    throw new Error(err)
  })
}

request.$paramsGet = function (url, params) {
  return this.$http.get(url, {params})
    .then(({status, body, code}) => {
      if (status === 200) {
        return body
      } else {
        throw new Error(`服务器出现错误！status:${status},code:${code},url:${url}`)
      }
    })
    .catch(err => {
      throw new Error(err)
    })
}

request.$filterGet = function (url, filter) {
  return this.$http.get(url, {params: {filter: {where: filter}}})
    .then(({status, body, code}) => {
      if (status === 200) {
        return body
      } else {
        throw new Error(`服务器出现错误！status:${status},code:${code},url:${url}`)
      }
    })
    .catch(err => {
      throw new Error(err)
    })
}

export default request
