import type * as RDF from 'rdf-js';

/**
 * A term that represents an RDF blank node with a label.
 */
export class BlankNode implements RDF.BlankNode {
  public readonly termType = 'BlankNode';
  public readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public equals(other?: RDF.Term | null): boolean {
    return !!other && other.termType === 'BlankNode' && other.value === this.value;
  }
}
