// Proyecto React desde cero para visualizar la colección por expansión sin dependencias externas

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://gfxxrydylfdfahfwpnrm.supabase.co"
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeHhyeWR5bGZkZmFoZndwbnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzI3MjcsImV4cCI6MjA2NjYwODcyN30.6zAJW6Dyi5FDVu5P4BgwdhzpVv2dSaGXaO29Xm1z-5w"
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  const [expansions, setExpansions] = useState([])
  const [selectedExpansion, setSelectedExpansion] = useState(null)
  const [cards, setCards] = useState([])

  useEffect(() => {
    supabase.from("expansions").select("id, name, code").then(({ data }) => {
      setExpansions(data || [])
    })
  }, [])

  useEffect(() => {
    if (selectedExpansion) {
      supabase
        .from("cards")
        .select("id, name, rarity, format, collection(quantity)")
        .eq("expansion_id", selectedExpansion.id)
        .order("name")
        .then(({ data }) => setCards(data || []))
    }
  }, [selectedExpansion])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Colección Star Wars Unlimited</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {expansions.map((exp) => (
          <button
            key={exp.id}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setSelectedExpansion(exp)}
          >
            {exp.name}
          </button>
        ))}
      </div>

      {selectedExpansion && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {selectedExpansion.name} ({selectedExpansion.code})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="border rounded-lg shadow p-4 bg-white"
              >
                <h3 className="font-bold text-lg mb-1">{card.name}</h3>
                <p className="text-sm">Rareza: {card.rarity}</p>
                <p className="text-sm">Formato: {card.format}</p>
                <p className="text-sm">Cantidad: {card.collection?.[0]?.quantity ?? 0}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
