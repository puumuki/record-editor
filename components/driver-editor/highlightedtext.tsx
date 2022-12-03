
interface HighlightedTextProps {
  text:string, 
  searchText:string
}

const HighlightedText = (props:HighlightedTextProps) => {
  const {text = '', searchText = ''} = props;  
  // Split text on highlight term, include term itself into parts, ignore case
  const parts:string[] = text.split(new RegExp(`(${searchText})`, 'gi'));
  return <span>{parts.map((part, i) => {
    return <span key={i}>{part.toLowerCase() === searchText.toLowerCase() ? <b>{part}</b> : part}</span>
  })}</span>;
} 

export default HighlightedText;