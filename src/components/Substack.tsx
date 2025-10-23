// components/Substack
import { substack } from "@vznh/substack"
import React from "react";

interface SubstackProps {
  sections: { header: string, body: string }[];
  page: number;
  totalPages: number;
  title: string;
}

const Substack: React.FC<SubstackProps> = ({
  sections,
  page,
  totalPages,
  title
}) => {
  return <div className="relative">
    <div className="grid grid-cols-2 gap-y-0 gap-x-8">
      {sections.map((sect: { header: string, body: string }, idx: number) => (
        <div key={idx}>
          <p className="font-bold">{sect.header}</p>
          <p className="text-justify">
            {sect.body}
          </p>
        </div>
      ))}
    </div>

  </div>

}

export { Substack }
