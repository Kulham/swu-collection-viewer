// Proyecto React para visualizar fácilmente si tienes una carta en un formato específico

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://gfxxrydylfdfahfwpnrm.supabase.co"
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeHhyeWR5bGZkZmFoZndwbnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzI3MjcsImV4cCI6MjA2NjYwODcyN30.6zAJW6Dyi5FDVu5P4BgwdhzpVv2dSaGXaO29Xm1z-5w"
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  const [expansions, setExpansions] = useState([])
  const [selectedExpansion, setSelectedExpansion] = useState(null)
  const [cards, setCards] = useState([])
  const [filterOwnedOnly, setFilterOwnedOnly] = useState(false)
  const [formatFilter, setFormatFilter] = useState("all")
  const [rarityFilter, setRarityFilter] = useState("all")

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

  const filteredCards = cards.filter((card) => {
    const ownedCheck = !filterOwnedOnly || (card.collection?.[0]?.quantity ?? 0) > 0
    const formatCheck = formatFilter === "all" || card.format === formatFilter
    const rarityCheck = rarityFilter === "all" || card.rarity === rarityFilter
    return ownedCheck && formatCheck && rarityCheck
  })

  const formatOptions = ["all", "Normal", "Foil", "Hyperspace", "Hyperspace Foil", "Showcase"]
  const rarityOptions = ["all", "C", "U", "R", "L", "S"]

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
          <h2 className="text-xl font-semibold mb-2">
            {selectedExpansion.name} ({selectedExpansion.code})
          </h2>

          <div className="mb-4 flex flex-wrap gap-4 items-center">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={filterOwnedOnly}
                onChange={() => setFilterOwnedOnly(!filterOwnedOnly)}
              />
              Mostrar solo cartas que tengo
            </label>

            <label className="inline-flex items-center gap-2">
              Formato:
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                {formatOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>

            <label className="inline-flex items-center gap-2">
              Rareza:
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                {rarityOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className={`border rounded-lg shadow p-4 ${
                  (card.collection?.[0]?.quantity ?? 0) > 0 ? "bg-green-50" : "bg-white"
                }`}
              >
                <h3 className="font-bold text-lg mb-1">{card.name}</h3>
                <p className="text-sm">Rareza: {card.rarity}</p>
                <p className="text-sm">Formato: {card.format}</p>
                <p className="text-sm">
                  {card.collection?.[0]?.quantity > 0
                    ? `Tengo ${card.collection[0].quantity}`
                    : "No la tengo"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
