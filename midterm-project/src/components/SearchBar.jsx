// Контролируемый input: значение приходит из state родителя (value),
// а при вводе мы сообщаем родителю новое значение (onChange).
function SearchBar({ value, onChange }) {
  return (
    <input
      className="input search"
      type="text"
      placeholder="Search by title or director..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default SearchBar
