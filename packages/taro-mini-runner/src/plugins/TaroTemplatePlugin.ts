import * as NodeHotUpdateChunkTemplatePlugin from 'webpack/lib/node/NodeHotUpdateChunkTemplatePlugin'
import TaroMainTemplatePlugin from './TaroMainTemplatePlugin'
import TaroChunkTemplatePlugin from './TaroChunkTemplatePlugin'

const PLUGIN_NAME = 'TaroTemplatePlugin'

export default class TaroTemplatePlugin {
    apply (compiler) {
      compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
        new TaroMainTemplatePlugin().apply(compilation.mainTemplate)
        new TaroChunkTemplatePlugin().apply(compilation.chunkTemplate)
        new NodeHotUpdateChunkTemplatePlugin().apply(compilation.hotUpdateChunkTemplate)
      })
    }
}
