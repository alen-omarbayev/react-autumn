// Сообщение об ошибке с кнопкой "Try again"
function ErrorMessage({ text, onRetry }) {
  return (
    <div className="message error">
      <p>Error: {text}</p>
      {onRetry && <button onClick={onRetry}>Try again</button>}
    </div>
  )
}

export default ErrorMessage
