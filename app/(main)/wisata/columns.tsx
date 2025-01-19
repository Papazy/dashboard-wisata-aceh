"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { ArrowUpDown, Eraser, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Modal from "react-modal"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type WisataType = {

    name: string,
    description: string,
    location_name: string,
    latitude: string,
    longitude: string,
    image_url: string,
    id: number,
    distance: number,
    average_rating: number
  
}

export const columns: ColumnDef<WisataType>[] = [
  {
    header: 'No',
    id: 'id',
    cell: ({ row, table }) =>(
      <div className="w-4">
      {(table.getSortedRowModel()?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1}
      </div>
    )
  },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({row}) => (<div className="w-60">{row.original.name}</div>),
    },
    {
      id: "description",
      header: "Description",
      cell: ({row}) => {
        const value = row.original.description;
        return value.length > 50 ? `${value.slice(0, 50)}...` : value;
      },
    },
    {
      id: "location_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Location
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({row}) => <div className="w-5">
        {row.original.location_name}
      </div>,
    },
    {
      id: "latitude",
      header: "Latitude",
      cell: ({row}) => <div className="w-5">
        {row.original.latitude}
      </div>,
    },
    {
      id: "longitude",
      header: "Longitude",
      cell: ({row}) => <div className="w-5">
        {row.original.longitude}
      </div>,
    },
    {
      id: "image_url",
      header: "Image",
      cell: ({ row }) => {
        const [isOpen, setIsOpen] = useState(false);
        const imageUrl = row.original.image_url || "/placeholder.png";
  
        const toggleModal = () => setIsOpen(!isOpen);
  
        return (
          <>
            <Image
              loader={() => imageUrl}
              src={imageUrl}
              width={100}
              height={100}
              style={{
                borderRadius: "5px",
                cursor: "pointer", // Indikator bahwa gambar bisa diklik
              }}
              alt="foto"
              onClick={toggleModal} // Membuka modal saat diklik
            />
            <Modal
              isOpen={isOpen}
              onRequestClose={toggleModal}
              shouldCloseOnOverlayClick={true}
              ariaHideApp={false}
              contentLabel="Preview Gambar"
              style={{
                content: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.0)",
                  border: "none",
                  padding: "0",
                },
                overlay: {
                  zIndex: 1000,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                },
              }}
            >
              <div style={{ position: "relative" }}>
                <button
                  onClick={toggleModal}
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    background: "transparent",
                    color: "white",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
                <Image
                  loader={() => imageUrl}
                  src={imageUrl}
                  width={500}
                  height={500}
                  style={{
                    borderRadius: "10px",
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                  }}
                  alt="Preview Foto"
                />
              </div>
            </Modal>
          </>
        );
      },
    },
    {
      id: "average_rating",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            
            Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({row}) => (<center>{Number(row.original.average_rating).toFixed(1)}</center>),
    },
    {
      header: 'Action',
      id: 'action',
      cell: ({ row }) => (
        <div className="flex justify-center gap-1 text-xs">
          <Button
          className="bg-green-600 text-xs px-2"
            onClick={() => {
              console.log("Edit", row.original.id);
            }}
          >
            <Pencil />Edit
          </Button>
          <Button
            variant="destructive"
            className="text-xs px-2"
            onClick={() => {
              console.log("Delete", row.original.id);
            }}
          >
            <Eraser /> Delete
          </Button>
        </div>
      ),  
    }
]

// {
//   "name": "string",
//   "description": "string",
//   "location_name": "string",
//   "latitude": "string",
//   "longitude": "string",
//   "image_url": "string",
//   "id": 0,
//   "distance": 0,
//   "average_rating": 0
// }
