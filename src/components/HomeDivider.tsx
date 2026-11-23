export function HomeDivider() {
  return (
    <div
      aria-hidden="true"
      className="home-divider"
      onAnimationEnd={(event) => {
        const divider = event.currentTarget
        if (divider.getBoundingClientRect().bottom <= window.innerHeight) divider.dataset.drawn = ''
      }}
    />
  )
}
