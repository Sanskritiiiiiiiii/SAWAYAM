test("renders SWAYAM homepage", () => {
  render(<App />);
  expect(screen.getByText(/SWAYAM/i)).toBeInTheDocument();
});
