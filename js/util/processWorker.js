const { spawnSync } = require('child_process')

onmessage = function (e) {
  const taskId = e.data.taskId
  const command = e.data.command
  const args = e.data.args
  const input = e.data.input
  const customEnv = e.data.customEnv
  const maxBuffer = e.data.maxBuffer

  try {
    const process = spawnSync(command, args, { input: input, encoding: 'utf8', env: customEnv, maxBuffer: maxBuffer })

    if (process.error || process.signal) {
      throw new Error('Process terminated: ' + process.stderr + ', ' + process.signal + ', ' + process.error)
    }

    let output = process.output[1]
    if (output.slice(-1) === '\n') {
      output = output.slice(0, -1)
    }

    postMessage({ taskId: taskId, result: output })
  } catch (e) {
    postMessage({ taskId: taskId, error: e.toString() })
  }
}
