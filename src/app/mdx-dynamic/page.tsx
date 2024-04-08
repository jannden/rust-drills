import fs from 'fs'
import path from 'path'

import xxx from '@/mdx/xxx.mdx'

const allMarkdownsAsComponents = {
  xxx,
}

const markdownFilePath = path.join(process.cwd(), 'src', 'mdx', 'xxx.mdx')
const xxx_text = fs.readFileSync(markdownFilePath, 'utf-8')

const allMarkdownsAsText = {
  xxx: xxx_text,
}

export default async function RemoteMdxPage() {
  const desiredMarkdown = 'xxx' as keyof typeof allMarkdownsAsComponents
  const Component = allMarkdownsAsComponents[desiredMarkdown]
  return (
    <div>
      <Component />
      <hr />
      {allMarkdownsAsText[desiredMarkdown]}
    </div>
  )
}
