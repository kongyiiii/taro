import * as path from 'path'
import * as webpack from 'webpack'

import { IBuildConfig } from './utils/types'
import { printBuildError, bindProdLogger } from './utils/logHelper'
import MiniPlugin, { Targets } from './plugins/MiniPlugin'

const extensions = ['.ts', '.tsx', '.js', '.jsx']

export default function build (config: IBuildConfig) {
  const compilePlugins = config.plugins
  const { babel } = compilePlugins
  const webpackConfig = {
    mode: config.isWatch ? 'development' : 'production',
    devtool: false,
    entry: config.entry,
    output: {
      filename: '[name].js',
      publicPath: '/',
			path: config.outputDir,
    },
    resolve: {
      extensions
    },
    target: Targets[config.buildAdapter],
    optimization: {
      runtimeChunk: {
        name: 'runtime'
      },
      splitChunks: {
        chunks: 'all',
        name: 'vendors'
      }
    },
    module: {
      rules: [
        {
					test: /\.(tsx?|jsx?)$/,
					exclude: /node_modules/,
					use: [{
            loader: path.resolve(__dirname, './loaders/fileParseLoader'),
            options: {
              babel,
              designWidth: config.designWidth,
              deviceRatio: config.deviceRatio,
              buildAdapter: config.buildAdapter,
              constantsReplaceList: config.constantsReplaceList,
              fileTypeMap: MiniPlugin.getTaroFileTypeMap()
            }
          }, {
            loader: path.resolve(__dirname, './loaders/wxTransformerLoader'),
            options: {
              buildAdapter: config.buildAdapter,
              fileTypeMap: MiniPlugin.getTaroFileTypeMap()
            }
          }]
        },
        {
          test: /\.(scss|wxss|acss|)$/,
					include: /src/,
					use: [
						{
              loader: require.resolve('file-loader'),
              options: {
                useRelativePath: true,
                name: `[path][name].wxss`,
                context: config.sourceDir
              }
            },
						{
							loader: require.resolve('sass-loader'),
							options: {

							},
						},
					],
        }
      ]
    },
    plugins: [
      new MiniPlugin({
        buildAdapter: config.buildAdapter,
        constantsReplaceList: config.constantsReplaceList
      })
    ]
  }

  const compiler = webpack(webpackConfig)
  bindProdLogger(compiler)

  compiler.run((err) => {
    if (err) {
      printBuildError(err)
    }
  })
}
