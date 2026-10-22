import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMovie } from '../api/moviesApi.js'
import MovieForm from '../components/MovieForm.jsx'

function AddMoviePage() {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // MovieForm вызывает эту функцию с готовыми данными фильма
  function handleAdd(movieData) {
    setIsSaving(true)
    setErrorMessage('')
    createMovie(movieData)
      .then((newMovie) => {
        // После сохранения переходим на страницу нового фильма
        navigate(`/movies/${newMovie.id}`)
      })
      .catch((error) => {
        setErrorMessage(error.message)
        setIsSaving(false)
      })
  }

  return (
    <div className="form-page">
      <h1>Add a movie</h1>
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      <MovieForm onSubmit={handleAdd} isSaving={isSaving} />
    </div>
  )
}

export default AddMoviePage
