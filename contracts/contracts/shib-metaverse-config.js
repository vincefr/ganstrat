// shib-metaverse-config.js
const D3Global = {
  plotSize: "100x100", // Standard plot
  location: "Entertainment District",
  coordinates: { x: -420, y: 69, z: 0 },
  buildingType: "Gaming Hub",
  maxCapacity: 500
}

// Three.js Preview
const MetaversePreview = () => {
  return (
    <Canvas camera={{ position: [0, 5, 10] }}>
      <ambientLight />
      <Box args={[100, 50, 100]}>
        <meshStandardMaterial color="#FFD700" />
      </Box>
      <Text3D text="GANSTRAT CASINO" />
    </Canvas>
  )
