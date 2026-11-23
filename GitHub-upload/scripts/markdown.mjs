import MarkdownIt from "markdown-it";
import katex from "katex";
import texmath from "markdown-it-texmath";

export const markdown = new MarkdownIt({html:false}).use(texmath,{
  engine:katex,
  delimiters:"dollars",
  katexOptions:{throwOnError:true,trust:false}
});
