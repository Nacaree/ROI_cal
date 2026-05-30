import InputSection from './InputSection.jsx'

function InputPanel({ sections, values, onChange }) {
  return (
    <div className="grid gap-4">
      {sections.map((section) => (
        <InputSection
          key={section.title}
          section={section}
          values={values}
          onChange={onChange}
        />
      ))}
    </div>
  )
}

export default InputPanel
