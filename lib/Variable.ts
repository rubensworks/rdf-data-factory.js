import type * as RDF from 'rdf-js';

/**
 * A term that represents a variable.
 */
export class Variable implements RDF.Variable {
  public readonly termType = 'Variable';
  public readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public equals(other?: RDF.Term | null): boolean {
    return !!other && other.termType === 'Variable' && other.value === this.value;
  }
}
